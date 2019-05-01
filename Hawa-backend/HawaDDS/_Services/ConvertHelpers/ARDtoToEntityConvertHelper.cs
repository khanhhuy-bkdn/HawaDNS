using _Common.Extensions;
using _Common.Runtime.Session;
using _Common.Timing;
using _Constants.EntityStatuses;
using _Dtos.AR.InputDtos;
using _Entities.AR;

namespace _Services.ConvertHelpers
{
    public static class ARDtoToEntityConvertHelper
    {
        public static ARContact ToARContactEntity(this CreateContactDto dto, int? userId)
        {
            return new ARContact
            {
                ARContactContributor = dto.Contributor,
                ARContactTitleContribute = dto.TitleContribute,
                FK_ARContactTypeID = dto.ContactTypeID,
                ARContactName = dto.ContactName,
                ARContactAcronymName = dto.AcronymName,
                ARContactUserContact = dto.UserContact,
                ARContactPhone1 = dto.Phone1,
                ARContactPhone2 = dto.Phone2,
                ARContactEmail = dto.Email,
                ARContactWebsite = dto.Website,
                ARContactNote = dto.Note,
                ARContactImage = dto.Images.JoinNotEmpty(";"),
                FK_GEStateProvinceID = dto.StateProvinceID,
                FK_GEDistrictID = dto.DistrictID,
                FK_GECommuneID = dto.CommuneID,
                ARUserHouseNumber = dto.HouseNumber,
                ARUserAddress = dto.Address,
                ARContactStatus = ContactStatus.ChuaDuyet,
                FK_CreatedUserID = userId
            };
        }

        public static ARContactReview ToARContactReviewEntity(this ReviewContactDto dto, IBysSession session)
        {
            return new ARContactReview
            {
                FK_ARContactID = dto.ContactId,
                FK_ReviewUserID = session.UserId,
                ARContactReviewContent = dto.Content,
                ARContactReviewTitle = dto.Title,
                ARContactReviewDate = Clock.Now,
                ARContactReviewRating = dto.Rating,
                ARContactReviewIsHide = false
            };
        }
    }
}