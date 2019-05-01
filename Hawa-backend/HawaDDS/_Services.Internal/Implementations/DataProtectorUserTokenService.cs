using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using _Common.Configurations;
using _Common.Exceptions;
using _Common.Extensions;
using _Common.Helpers;
using _Common.Timing;
using _Constants.EntityTypes;
using _Entities.AD;
using _EntityFrameworkCore.UnitOfWork;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Options;

namespace _Services.Internal.Implementations
{
    public class DataProtectorUserTokenService : IDataProtectorUserTokenService
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly TokenLifespanExpire _tokenLifespanExpire;

        private const double DefaultTokenLifeSpan = 2.0;

        private Dictionary<int, int> resetPasswordActiveCodes = new Dictionary<int, int>();

        public IDataProtector Protector { get; }

        public DataProtectorUserTokenService(IDataProtectionProvider provider, IUnitOfWork unitOfWork, IOptions<TokenLifespanExpire> tokenLifespanExpire)
        {
            _tokenLifespanExpire = tokenLifespanExpire.Value;
            _unitOfWork = unitOfWork;
            Protector = provider.CreateProtector("Web API v1");
        }

        public int GenerateResetPasswordActiveCode(int userId)
        {
            if (resetPasswordActiveCodes.ContainsKey(userId))
            {
                resetPasswordActiveCodes.Remove(userId);
            }

            var activeCode = RandomHelper.GetRandom(100000, 999999);
            resetPasswordActiveCodes.Add(userId, activeCode);

            return activeCode;
        }

        public bool ValidateResetPasswordActiveCode(int userId, int activeCode)
        {
            return resetPasswordActiveCodes.ContainsKey(userId) && resetPasswordActiveCodes[userId] == activeCode;
        }

        public async Task<string> GenerateResetPasswordTokenAsync(int userId)
        {
            return await GenerateTokenAsync(TokenPurpose.ResetPasswordTokenPurpose, userId);
        }

        public bool ValidateResetPasswordToken(int userId, string token)
        {
            return Validate(TokenPurpose.ResetPasswordTokenPurpose, token, userId);
        }

        public async Task<string> GenerateVerifyUserTokenAsync(int userId)
        {
            return await GenerateTokenAsync(TokenPurpose.VerifyUserTokenPurpose, userId);
        }

        public bool ValidateVerifyUserToken(int userId, string token)
        {
            return Validate(TokenPurpose.VerifyUserTokenPurpose, token, userId);
        }

        private async Task<string> GenerateTokenAsync(string purpose, int userId)
        {
            using (var ms = new MemoryStream())
            {
                using (var binaryWriter = ms.CreateWriter())
                {
                    binaryWriter.Write(DateTimeOffset.UtcNow);
                    binaryWriter.Write(userId.ToString());
                    binaryWriter.Write(purpose ?? "");
                }

                var token =  Convert.ToBase64String(Protector.Protect(ms.ToArray()));

                await SaveTokenAsync(userId, token, purpose);
                return token;
            }
        }

        public bool Validate(string purpose, string token, int userId)
        {
            var userToken = _unitOfWork.GetRepository<ADUserToken>().GetFirstOrDefault(
                x => x.FK_ADUserId == userId
                && x.ADUserTokenValue == token
                && x.ADUserTokenPurpose == purpose);

            if(userToken == null)
            {
                return false;
            }

            if(userToken.ADUserTokenExpire < Clock.Now)
            {
                throw new TokenExpireException("Token của bạn đã quá hạn.");
            }

            return true;
        }

        public async Task DeleteTokenAsync(string token)
        {
            await _unitOfWork.GetRepository<ADUserToken>().DeleteAsync(x => x.ADUserTokenValue == token);
        }

        private async Task SaveTokenAsync(int userId, string token, string purpose)
        {
            var lifeSpan = 0.0;

            switch (purpose)
            {
                case TokenPurpose.ResetPasswordTokenPurpose:
                    lifeSpan = _tokenLifespanExpire.ResetPasswordTokenLifespan; break;
                case TokenPurpose.VerifyUserTokenPurpose:
                    lifeSpan = _tokenLifespanExpire.VerifyUserTokenLifespan; break;
                default:
                    lifeSpan = DefaultTokenLifeSpan; break;
            }

            var userToken = await _unitOfWork.GetRepository<ADUserToken>()
                                .GetFirstOrDefaultAsync(x => x.FK_ADUserId == userId && x.ADUserTokenPurpose == purpose)
                            ?? new ADUserToken
                            {
                                ADUserTokenValue = token,
                                ADUserTokenPurpose = purpose,
                                ADUserTokenExpire = Clock.Now.AddDays(lifeSpan),
                                FK_ADUserId = userId
                            };

            userToken.ADUserTokenValue = token;

            await _unitOfWork.GetRepository<ADUserToken>().InsertOrUpdateAsync(userToken);

            await _unitOfWork.CompleteAsync();
        }
    }
}