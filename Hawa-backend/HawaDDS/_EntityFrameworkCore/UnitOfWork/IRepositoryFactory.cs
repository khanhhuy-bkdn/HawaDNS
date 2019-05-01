using _Entities.Interfaces;

namespace _EntityFrameworkCore.UnitOfWork
{
    public interface IRepositoryFactory
    {
        IRepository<TEntity> GetRepository<TEntity>() where TEntity : class, IEntity;
    }
}