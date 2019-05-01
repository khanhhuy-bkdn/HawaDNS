using System.Collections.Generic;
using System.Linq;

using _Common.Extensions;
using _Common.Helpers;
using _Constants;
using _Constants.EntityStatuses;
using _Constants.EntityTypes;
using _Dtos;
using _Dtos.AR;
using _Entities.AR;
using _Entities.GE;
using _Services.Internal.Helpers;

namespace _Services.ConvertHelpers
{
    public static class AREntityToDtoConvertHelper
    {
        public static ContactDto ToContactDto(this ARContact entity)
        {
            return entity == null
                ? null
                : new ContactDto
                {
                    Id = entity.Id,
                    Email = entity.ARContactEmail,
                    AcronymName = entity.ARContactAcronymName,
                    Images = entity.ARContactImage.SplitBy(";").Select(x => x + CommonConstants.DefaultImageExtension).ConvertArray(ImageUrlHelper.ToImageUrl),
                    HouseNumber = entity.ARUserHouseNumber,
                    Website = entity.ARContactWebsite,
                    Contributor = entity.ADCreatedUser.ToShortUserDto(),
                    StateProvince = entity.GEStateProvince.ToDictionaryItemDto(),
                    TitleContribute = entity.ARContactTitleContribute,
                    Detail = entity.ARContactDetail,
                    Note = entity.ARContactNote,
                    Commune = entity.GECommune.ToDictionaryItemDto(),
                    District = entity.GEDistrict.ToDictionaryItemDto(),
                    ContactName = entity.ARContactName,
                    Phone1 = entity.ARContactPhone1,
                    Phone2 = entity.ARContactPhone2,
                    ContactType = entity.ARContactType.ToDictionaryItemDto(),
                    Address = entity.ARUserAddress,
                    UserContact = entity.ARContactUserContact,
                    UserType = entity.ARContactUserType.ToDictionaryItemDto<UserType>(),
                    AverageRating = entity.ARContactEvalution.GetValueOrDefault(),
                    AggregateOfRatings = entity.ARContactReviews.ToAggregateOfRatings(),
                    ContributeDate = entity.AACreatedDate.ToSecondsTimestamp(),
                    LocationInCharge = entity.ARContactForestCommuneGroups.ConvertArray(
                        x => new ContactLocationInChargeDto
                        {
                            Commune = x.GECommune.ToDictionaryItemDto(),
                            District = x.GECommune?.GEDistrict.ToDictionaryItemDto(),
                            StateProvince = x.GECommune?.GEDistrict?.GEStateProvince.ToDictionaryItemDto()
                        })
                };
        }

        public static ShortContactDto ToShortContactDto(this ARContact entity)
        {
            return entity == null
                ? null
                : new ShortContactDto
                {
                    Id = entity.Id,
                    Email = entity.ARContactEmail,
                    Contributor = entity.ADCreatedUser.ToShortUserDto(),
                    ContactName = entity.ARContactName,
                    Phone1 = entity.ARContactPhone1,
                    UserContact = entity.ARContactUserContact,
                    ContributeDate = entity.AACreatedDate.ToSecondsTimestamp(),
                    Status = entity.ARContactStatus.ToDictionaryItemDto<ContactStatus>(),
                    AverageRating = entity.ARContactEvalution.GetValueOrDefault(),
                    AggregateOfRatings = entity.ARContactReviews.ToAggregateOfRatings(),
                    TitleContribute = entity.ARContactTitleContribute,
                    ReviewCount = entity.ARContactReviews.ToReviewCount(),
                };
        }

        public static decimal ToAverageRating(this ICollection<ARContactReview> list)
        {
            return list.IsNullOrEmpty()
                ? 0
                : (decimal)list
                      .Sum(x => x.ARContactReviewRating)
                  / list.Count;
        }

        public static int ToReviewCount(this ICollection<ARContactReview> list)
        {
            return list.IsNullOrEmpty() ? 0 : list.Count;
        }

        private static AggregateOfRatingDto[] ToAggregateOfRatings(this IEnumerable<ARContactReview> contactReviews)
        {
            return Enumerable.Range(1, 5)
                .ConvertArray(
                    x => new AggregateOfRatingDto
                    {
                        Rating = x,
                        Percent = contactReviews.IsNullOrEmpty()
                            ? 0
                            : (decimal)contactReviews
                                  .Count(y => y.ARContactReviewRating == x)
                              / contactReviews.Count() * 100
                    });
        }

        public static ReviewItemDto ToContactReviewDto(this ARContactReview entity)
        {
            return entity == null
                ? null
                : new ReviewItemDto
                {
                    Id = entity.Id,
                    Title = entity.ARContactReviewTitle,
                    Content = entity.ARContactReviewContent,
                    ReviewDate = entity.ARContactReviewDate.ToSecondsTimestamp(),
                    Rating = entity.ARContactReviewRating,
                    ReviewUser = entity.ADUser.ToShortUserDto(),
                    Contact = entity.ARContact.ToContactDto(),
                    Hidden = entity.ARContactReviewIsHide.GetValueOrDefault(),
                };
        }

        public static SummaryCommuneContactDto ToSummaryCommuneContactDto(this GECommune entity)
        {
            return entity == null
                ? null
                : new SummaryCommuneContactDto
                {
                    StateProvince = entity.GEDistrict?.GEStateProvince.ToDictionaryItemDto(),
                    Commune = entity.ToDictionaryItemDto(),
                    District = entity.GEDistrict.ToDictionaryItemDto(),
                    ReviewCount = entity.ARContactForestCommuneGroups.Count,
                    NotConfirmStatusCount = entity.ARContactForestCommuneGroups.Count(x => x.ARContact?.ARContactStatus == ContactStatus.ChuaDuyet),
                    PendingStatusCount = entity.ARContactForestCommuneGroups.Count(x => x.ARContact?.ARContactStatus == ContactStatus.DangXacMinh)
                };
        }

        public static ContactStatusCountDto ToContactStatusCountDto(this ARContactForestCommuneGroup[] entities)
        {
            return entities.IsNullOrEmpty()
                ? null
                : new ContactStatusCountDto
                {
                    Total = entities.Length,
                    ChuaDuyet = entities.Count(x => x.ARContact.ARContactStatus == ContactStatus.ChuaDuyet),
                    DaDuyet = entities.Count(x => x.ARContact.ARContactStatus == ContactStatus.DaDuyet),
                    HuyBo = entities.Count(x => x.ARContact.ARContactStatus == ContactStatus.HuyBo),
                    DangXacMinh = entities.Count(x => x.ARContact.ARContactStatus == ContactStatus.DangXacMinh),
                    StateProvince = entities.FirstOrDefault()?.GEStateProvince.ToDictionaryItemDto(),
                    District = entities.FirstOrDefault()?.GEDistrict.ToDictionaryItemDto(),
                    Commune = entities.FirstOrDefault()?.GECommune.ToDictionaryItemDto()
                };
        }
    }
}