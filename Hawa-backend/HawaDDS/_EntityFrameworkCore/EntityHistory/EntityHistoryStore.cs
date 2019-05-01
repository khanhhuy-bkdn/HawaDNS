using System.Threading.Tasks;

using _EntityFrameworkCore.UnitOfWork;

namespace _EntityFrameworkCore.EntityHistory
{
    public static class EntityHistoryStore
    {
        public static async Task SaveAsync(IUnitOfWork unitOfWork, EntityChangeSet entityChangeSet)
        {
            await unitOfWork.Context.SaveChangesAsync();
        }
    }
}