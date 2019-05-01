using System;
using System.Linq;
using System.Threading.Tasks;

using _Entities.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace _EntityFrameworkCore.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        // Review: this is in IUnitOfWorkOfT: not here
        DbContext Context { get; }

        void ChangeDatabase(string database);

        IRepository<TEntity> GetRepository<TEntity>() where TEntity : class, IEntity;

        int Complete(bool ensureAutoHistory = false);

        Task<int> CompleteAsync(bool ensureAutoHistory = false);

        int ExecuteSqlCommand(string sql, params object[] parameters);

        IQueryable<TEntity> FromSql<TEntity>(string sql, params object[] parameters) where TEntity : class;
    }
}