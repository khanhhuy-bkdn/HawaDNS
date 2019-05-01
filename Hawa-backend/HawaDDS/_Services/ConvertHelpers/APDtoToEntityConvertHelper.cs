using _Common.Runtime.Session;
using _Common.Timing;
using _Constants.EntityStatuses;
using _Dtos.AP.InputDtos;
using _Entities.AP;

namespace _Services.ConvertHelpers
{
    public static class APDtoToEntityConvertHelper
    {
        public static APActorReview ToAPActorReviewEntity(this ReviewForestPlotActorDto dto, IBysSession session)
        {
            return new APActorReview
            {
                FK_APActorID = dto.ActorId,
                FK_ReviewUserID = session.UserId,
                FK_ICForestPlotID = dto.ForestPlotId,
                APActorReviewRating = dto.Rating,
                APActorReviewTitle = dto.Title,
                APActorReviewContent = dto.Content,
                APActorReviewDate = Clock.Now,
                APActorReviewIsHide = false
            };
        }

        public static APActor ToAPActorEntity(this CreateActorDto dto)
        {
            return new APActor
            {
                APActorAcronymName = dto.AcronymName,
                APActorAddress = dto.Address,
                APActorFax = dto.Fax,
                APActorHouseNumber = dto.HouseNumber,
                APActorIdentityCard = dto.IdentityCard,
                APActorName = dto.Name,
                APActorPhone = dto.Phone,
                APActorTaxNumber = dto.TaxNumber,
                FK_GECommuneID = dto.CommuneID,
                FK_GEDistrictID = dto.DistrictID,
                FK_GEStateProvinceID = dto.StateProvinceID,
                APActorRepresentative = dto.Representative,
                APActorWebsite = dto.Website,
                APActorStatus = UserStatus.Active
            };
        }
    }
}