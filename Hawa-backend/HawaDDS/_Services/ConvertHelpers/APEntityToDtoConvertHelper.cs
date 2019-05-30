using System.Collections.Generic;
using System.Linq;

using _Common.Extensions;
using _Common.Helpers;
using _Constants.EntityStatuses;
using _Dtos;
using _Dtos.AP;
using _Entities.AP;
using _Entities.IC;
using _Services.Internal.Helpers;

namespace _Services.ConvertHelpers
{
    public static class APEntityToDtoConvertHelper
    {
        public static ActorDto ToActorDto(this APActor entity)
        {
            return entity == null
                ? null
                : new ActorDto
                {
                    Id = entity.Id,
                    Email = entity.APActorEmail,
                    Phone = entity.APActorPhone,
                    Name = entity.APActorName,
                    Website = entity.APActorWebsite,
                    Avatar = entity.APActorAvatar.ToImageUrl(),
                    ContactName = entity.APActorContactName,
                    ContactPhone = entity.APActorContactPhone,
                    Note = entity.APActorNote,
                    Type = entity.APActorType.ToActorTypeDto(),
                    Roles = entity.APActorRoles.ConvertArray(x => x?.APRole.ToDictionaryItemDto()),
                    Status = entity.APActorStatus.ToDictionaryItemDto<UserStatus>(),
                    AcronymName = entity.APActorAcronymName,
                    Address = entity.APActorAddress,
                    Commune = entity.GECommune.ToDictionaryItemDto(),
                    District = entity.GEDistrict.ToDictionaryItemDto(),
                    Fax = entity.APActorFax,
                };
        }

        public static ActorDto ToActorDto(this APActor entity, APActorReview[] actorReviews)
        {
            return entity == null
                ? null
                : new ActorDto
                {
                    Id = entity.Id,
                    Email = entity.APActorEmail,
                    Phone = entity.APActorPhone,
                    Name = entity.APActorName,
                    Website = entity.APActorWebsite,
                    Avatar = entity.APActorAvatar.ToImageUrl(),
                    AverageRating = actorReviews.IsNullOrEmpty() ? 0 : (decimal)actorReviews.Sum(x => x.APActorReviewRating) / actorReviews.Length,
                    AggregateOfRatings = actorReviews.ToAggregateOfRatings(),
                    Reviews = actorReviews.ConvertArray(x => x.ToReviewItemDto()),
                    AcronymName = entity.APActorAcronymName,
                    Address = entity.APActorAddress,
                    Commune = entity.GECommune.ToDictionaryItemDto(),
                    District = entity.GEDistrict.ToDictionaryItemDto(),
                    Fax = entity.APActorFax,
                    HouseNumber = entity.APActorHouseNumber,
                    IdentityCard = entity.APActorIdentityCard,
                    Representative = entity.APActorRepresentative,
                    StateProvince = entity.GEStateProvince.ToDictionaryItemDto(),
                    Type = entity.APActorType.ToActorTypeDto(),
                    Roles = entity.APActorRoles.ConvertArray(x => x?.APRole.ToDictionaryItemDto()),
                    Status = entity.APActorStatus.ToDictionaryItemDto<UserStatus>(),
                    ContactName = entity.APActorContactName,
                    ContactPhone = entity.APActorContactPhone,
                    Note = entity.APActorNote
                };
        }

        private static AggregateOfRatingDto[] ToAggregateOfRatings(this APActorReview[] actorReviews)
        {
            return Enumerable.Range(1, 5)
                .ConvertArray(
                    x => new AggregateOfRatingDto
                    {
                        Rating = x,
                        Percent = actorReviews.IsNullOrEmpty() ? 0 : (decimal)actorReviews.Count(y => y.APActorReviewRating == x) / actorReviews.Length * 100
                    });
        }

        public static ActorTypeDto ToActorTypeDto(this APActorType entity)
        {
            return entity == null
                ? null
                : new ActorTypeDto
                {
                    Id = entity.Id,
                    Code = entity.APActorTypeCode,
                    Name = entity.APActorTypeName,
                    AcronymName = entity.APActorTypeAcronymName
                };
        }

        public static ReviewItemDto ToReviewItemDto(this APActorReview entity)
        {
            return entity == null
                ? null
                : new ReviewItemDto
                {
                    Id = entity.Id,
                    Rating = entity.APActorReviewRating,
                    Title = entity.APActorReviewTitle,
                    Content = entity.APActorReviewContent,

                    //Actor = entity.APActor.ToActorDto(),
                    ReviewUser = entity.ADUser.ToShortUserDto(),
                    ReviewDate = entity.APActorReviewDate.ToSecondsTimestamp(),

                    //ForestPlot = entity.ICForestPlot.ToForestPlotDetailDto()
                    Hidden = entity.APActorReviewIsHide.GetValueOrDefault(false),
                    ForestPlotId = entity.FK_ICForestPlotID.GetValueOrDefault()
                };
        }

        public static ActorDto ToActorDto(this ICForestPlot entity)
        {
            return entity == null
                ? null
                : new ActorDto
                {
                    Id = entity.APActor.Id,
                    Email = entity.APActor.APActorEmail,
                    Phone = entity.APActor.APActorPhone,
                    Name = entity.APActor.APActorName,
                    Website = entity.APActor.APActorWebsite,
                    Avatar = entity.APActor.APActorAvatar.ToImageUrl(),
                    AverageRating = entity.APActorReviews.IsNullOrEmpty() ? 0 : (decimal)entity.APActorReviews.Sum(x => x.APActorReviewRating) / entity.APActorReviews.Count,
                    AggregateOfRatings = entity.APActorReviews.ToArray().ToAggregateOfRatings(),
                    Reviews = entity.APActorReviews.ConvertArray(x => x.ToReviewItemDto()),
                    AcronymName = entity.APActor.APActorAcronymName,
                    Address = entity.APActor.APActorAddress,
                    Commune = entity.APActor.GECommune.ToDictionaryItemDto(),
                    District = entity.GEDistrict.ToDictionaryItemDto(),
                    Fax = entity.APActor.APActorFax,
                    HouseNumber = entity.APActor.APActorHouseNumber,
                    IdentityCard = entity.APActor.APActorIdentityCard,
                    Representative = entity.APActor.APActorRepresentative,
                    StateProvince = entity.GEStateProvince.ToDictionaryItemDto(),
                    Type = entity.APActor.APActorType.ToActorTypeDto(),
                    Roles = entity.APActor.APActorRoles.ConvertArray(x => x?.APRole.ToDictionaryItemDto()),
                    Status = entity.APActor.APActorStatus.ToDictionaryItemDto<UserStatus>(),
                    ForestPlot = entity.ToForestPlotDto(),
                    ContactName = entity.APActor.APActorContactName,
                    ContactPhone = entity.APActor.APActorContactPhone,
                    Note = entity.APActor.APActorNote
                };
        }

        public static ShortActorDto ToShortActorDto(this ICForestPlot entity)
        {
            return entity == null
                ? null
                : new ShortActorDto
                {
                    Name = entity.APActor.APActorName,
                    Type = entity.APActor?.APActorType.ToActorTypeDto(),
                    Email = entity.APActor.APActorEmail,
                    Phone = entity.APActor.APActorPhone,
                    Website = entity.APActor.APActorWebsite,
                    ForestPlot = entity.ToForestPlotDto(),
                    AverageRating = entity.APActorReviews.Where(o => o.FK_APActorID == entity.FK_APActorID).Count() > 0 
                    ? entity.APActorReviews.ToAverageRating(entity) : 5,
                    ReviewCount = entity.APActorReviews.Where(o => o.FK_APActorID == entity.FK_APActorID).Count() > 0 
                    ? entity.APActorReviews.Where(o => o.FK_APActorID == entity.FK_APActorID).Count() : 0
                };
        }

        public static decimal ToAverageRating(this ICollection<APActorReview> list, ICForestPlot entity)
        {
            return list.IsNullOrEmpty()
                ? 0
                : (decimal)list.Where(o => o.FK_APActorID == entity.FK_APActorID)
                      .Sum(x => x.APActorReviewRating)
                  / (list.Where(o => o.FK_APActorID == entity.FK_APActorID).Count());
        }
    }
}