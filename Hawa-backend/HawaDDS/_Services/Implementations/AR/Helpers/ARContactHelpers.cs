using _Common.Exceptions;
using _Constants.EntityStatuses;
using _Entities.AR;

namespace _Services.Implementations.AR.Helpers
{
    public static class ARContactHelpers
    {
        public static void CheckContactStatusTransition(ARContact contact, string contactStatus)
        {
            bool isValid = (contactStatus != ContactStatus.ChuaDuyet) && (contact.ARContactStatus != ContactStatus.HuyBo);

            if (contactStatus == ContactStatus.DangXacMinh)
            {
                isValid = contact.ARContactStatus == ContactStatus.ChuaDuyet;
            }

            if (!isValid)
            {
                throw new BusinessException("Trạng thái liên hệ không hợp lệ");
            }
        }
    }
}