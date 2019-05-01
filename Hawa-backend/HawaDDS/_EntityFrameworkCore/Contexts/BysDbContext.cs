using System;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using _Entites;
using _Entities;
using _Entities.Interfaces;
using _EntityFrameworkCore.Audits;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace _EntityFrameworkCore.Contexts
{
    public abstract class BysDbContext : DbContext
    {
        private static readonly MethodInfo ConfigureGlobalFiltersMethodInfo = typeof(BysDbContext).GetMethod(nameof(ConfigureGlobalFilters), BindingFlags.Instance | BindingFlags.NonPublic);
        private readonly IAuditHelper _auditHelper;

        protected BysDbContext(DbContextOptions options, IAuditHelper auditHelper)
            : base(options)
        {
            _auditHelper = auditHelper;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                ConfigureGlobalFiltersMethodInfo
                    .MakeGenericMethod(entityType.ClrType)
                    .Invoke(this, new object[] { modelBuilder, entityType });
            }
        }

        public override int SaveChanges()
        {
            try
            {
                ApplyBysConcepts();
                var result = base.SaveChanges();

                return result;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new DBConcurrencyException(ex.Message, ex);
            }
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            try
            {
                ApplyBysConcepts();
                var result = await base.SaveChangesAsync(cancellationToken);
                return result;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new DBConcurrencyException(ex.Message, ex);
            }
        }

        protected virtual void ApplyBysConcepts()
        {
            foreach (var entry in ChangeTracker.Entries().ToList())
            {
                _auditHelper.ApplyBysConcepts(entry);
            }
        }

        protected void ConfigureGlobalFilters<TEntity>(ModelBuilder modelBuilder, IMutableEntityType entityType)
            where TEntity : class
        {
            if (entityType.BaseType == null && ShouldFilterEntity<TEntity>(entityType))
            {
                var filterExpression = CreateFilterExpression<TEntity>();
                if (filterExpression != null)
                {
                    modelBuilder.Entity<TEntity>().HasQueryFilter(filterExpression);
                }
            }
        }

        protected virtual bool ShouldFilterEntity<TEntity>(IMutableEntityType entityType) where TEntity : class
        {
            if (typeof(IStatusableEntity).IsAssignableFrom(typeof(TEntity)))
            {
                return true;
            }

            return false;
        }

        protected virtual Expression<Func<TEntity, bool>> CreateFilterExpression<TEntity>()
            where TEntity : class
        {
            Expression<Func<TEntity, bool>> expression = null;

            if (typeof(IStatusableEntity).IsAssignableFrom(typeof(TEntity)))
            {
                /* This condition should normally be defined as below:
                 * !IsSoftDeleteFilterEnabled || !((ISoftDelete) e).IsDeleted
                 * But this causes a problem with EF Core (see https://github.com/aspnet/EntityFrameworkCore/issues/9502)
                 * So, we made a workaround to make it working. It works same as above.
                 */

                Expression<Func<TEntity, bool>> softDeleteFilter = e => ((IStatusableEntity)e).AAStatus == EntityStatus.Alive;
                expression = softDeleteFilter;
            }

            return expression;
        }
    }
}