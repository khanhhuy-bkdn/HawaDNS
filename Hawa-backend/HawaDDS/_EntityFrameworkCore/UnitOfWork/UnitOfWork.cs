using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

using _Common.Extensions;
using _Common.Helpers;
using _Entities.Interfaces;
using _EntityFrameworkCore.EntityHistory;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage;

namespace _EntityFrameworkCore.UnitOfWork
{
    public class UnitOfWork<TContext> : IRepositoryFactory, IUnitOfWork<TContext> where TContext : DbContext
    {
        private readonly TContext _context;
        private bool disposed;
        private Dictionary<Type, object> repositories;

        private readonly IEntityHistoryHelper _entityHistoryHelper;

        public UnitOfWork(TContext context, IEntityHistoryHelper entityHistoryHelper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _entityHistoryHelper = entityHistoryHelper;
        }

        public DbContext Context => _context;

        public void ChangeDatabase(string database)
        {
            var connection = _context.Database.GetDbConnection();
            if (connection.State.HasFlag(ConnectionState.Open))
            {
                connection.ChangeDatabase(database);
            }
            else
            {
                var connectionString = Regex.Replace(connection.ConnectionString.Replace(" ", ""), @"(?<=[Dd]atabase=)\w+(?=;)", database, RegexOptions.Singleline);
                connection.ConnectionString = connectionString;
            }

            // Following code only working for mysql.
            var items = _context.Model.GetEntityTypes();
            foreach (var item in items)
            {
                if (item.Relational() is RelationalEntityTypeAnnotations extensions)
                {
                    extensions.Schema = database;
                }
            }
        }

        public IRepository<TEntity> GetRepository<TEntity>() where TEntity : class, IEntity
        {
            if (repositories == null)
            {
                repositories = new Dictionary<Type, object>();
            }

            var type = typeof(TEntity);
            if (!repositories.ContainsKey(type))
            {
                repositories[type] = new EfRepository<TEntity>(_context);
            }

            return (IRepository<TEntity>)repositories[type];
        }

        public int ExecuteSqlCommand(string sql, params object[] parameters) => _context.Database.ExecuteSqlCommand(sql, parameters);

        public IQueryable<TEntity> FromSql<TEntity>(string sql, params object[] parameters) where TEntity : class => _context.Set<TEntity>().FromSql(sql, parameters);

        public int Complete(bool ensureAutoHistory = false)
        {
            var changeSet = _entityHistoryHelper?.CreateEntityChangeSet(Context.ChangeTracker.Entries().ToList());

            var result = _context.SaveChanges();

            if (changeSet.EntityChanges.IsNullOrEmpty())
            {
                return result;
            }

            _entityHistoryHelper?.UpdateChangeSet(changeSet);

            AsyncHelper.RunSync(() => EntityHistoryStore.SaveAsync(this, changeSet));

            return result;
        }

        public async Task<int> CompleteAsync(bool ensureAutoHistory = false)
        {
            var changeSet = _entityHistoryHelper?.CreateEntityChangeSet(Context.ChangeTracker.Entries().ToList());

            var result = await _context.SaveChangesAsync();

            if (changeSet.EntityChanges.IsNullOrEmpty())
            {
                return result;
            }

            _entityHistoryHelper?.UpdateChangeSet(changeSet);

            await EntityHistoryStore.SaveAsync(this, changeSet);

            return result;
        }

        public async Task<int> CompleteAsync(bool ensureAutoHistory = false, params IUnitOfWork[] unitOfWorks)
        {
            // TransactionScope will be included in .NET Core v2.0
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var count = 0;
                    foreach (var unitOfWork in unitOfWorks)
                    {
                        var uow = unitOfWork as UnitOfWork<DbContext>;
                        uow.Context.Database.UseTransaction(transaction.GetDbTransaction());
                        count += await uow.CompleteAsync(ensureAutoHistory);
                    }

                    count += await CompleteAsync(ensureAutoHistory);

                    transaction.Commit();

                    return count;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();

                    throw ex;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);

            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    // clear repositories
                    if (repositories != null)
                    {
                        repositories.Clear();
                    }

                    // dispose the db context.
                    _context.Dispose();
                }
            }

            disposed = true;
        }
    }
}