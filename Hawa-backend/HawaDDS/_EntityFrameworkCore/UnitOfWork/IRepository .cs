using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

using _Entities.Interfaces;

namespace _EntityFrameworkCore.UnitOfWork
{
    public interface IRepository<TEntity> where TEntity : class, IEntity
    {
        IQueryable<TEntity> GetAll();

        IQueryable<TEntity> GetExpandableQuery();

        IQueryable<TEntity> GetIncludingExpandableQuery(params Expression<Func<TEntity, object>>[] propertySelectors);

        IQueryable<TEntity> GetAllIncluding(params Expression<Func<TEntity, object>>[] propertySelectors);

        TEntity GetFirstOrDefault(Expression<Func<TEntity, bool>> predicate);

        Task<TEntity> GetFirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate);

        Task<TEntity> GetAsync(int id);

        TEntity Get(int id);

        bool Exist(Expression<Func<TEntity, bool>> predicate);

        Task<bool> ExistAsync(Expression<Func<TEntity, bool>> predicate);

        IQueryable<TEntity> FromSql(string sql, params object[] parameters);

        Task<TEntity> SingleAsync(Expression<Func<TEntity, bool>> predicate);

        Task BulkInsertAsync(TEntity[] entities);

        void BulkInsert(TEntity[] entities);

        TEntity Insert(TEntity entity);

        Task<TEntity> InsertAsync(TEntity entity);

        TEntity InsertAndGet(TEntity entity);

        Task<TEntity> InsertAndGetAsync(TEntity entity);

        TEntity InsertOrUpdateAndGet(TEntity entity);

        TEntity InsertOrUpdate(TEntity entity);

        Task<TEntity> InsertOrUpdateAndGetAsync(TEntity entity);

        Task<TEntity> InsertOrUpdateAsync(TEntity entity);

        TEntity Update(TEntity entity);

        Task<TEntity> UpdateAsync(TEntity entity);

        void Deactive(TEntity entity);

        void Deactive(int id);

        void Active(TEntity entity);

        void Active(int id);

        void Delete(TEntity entity);

        Task DeleteAsync(TEntity entity);

        void Delete(int id);

        Task DeleteAsync(int id);

        void Delete(Expression<Func<TEntity, bool>> predicate);

        Task DeleteAsync(Expression<Func<TEntity, bool>> predicate);

        int Count(Expression<Func<TEntity, bool>> predicate);

        Task<int> CountAsync();

        Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate);
    }
}