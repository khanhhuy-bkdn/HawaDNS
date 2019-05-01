using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

using _Common.Extensions;
using _Common.Runtime.Session;
using _Common.Timing;
using _Entites;
using _Entities;
using _Entities.Attributes;
using _Entities.Interfaces;

using JetBrains.Annotations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace _EntityFrameworkCore.EntityHistory
{
    public class EntityHistoryHelper : IEntityHistoryHelper
    {
        private IBysSession BysSession { get; set; }

        public EntityHistoryHelper(IBysSession session)
        {
            BysSession = session;
        }

        public virtual EntityChangeSet CreateEntityChangeSet(ICollection<EntityEntry> entityEntries)
        {
            var changeSet = new EntityChangeSet
            {
                UserId = BysSession.GetUserId() ?? 0,
                UserName = BysSession.UserName,
            };

            foreach (var entry in entityEntries)
            {
                if (!ShouldSaveEntityHistory(entry))
                {
                    continue;
                }

                var entityChangeInfo = CreateEntityChangeInfo(entry);
                if (entityChangeInfo == null)
                {
                    continue;
                }

                changeSet.EntityChanges.Add(entityChangeInfo);
            }

            return changeSet;
        }

        //public virtual async Task SaveAsync(EntityChangeSet changeSet)
        //{
        //    if (changeSet.EntityChanges.Count == 0)
        //    {
        //        return;
        //    }

        //    UpdateChangeSet(changeSet);

        //    await EntityHistoryStore.SaveAsync(changeSet);
        //}

        [CanBeNull]
        private EntityChange CreateEntityChangeInfo(EntityEntry entityEntry)
        {
            var entity = entityEntry.Entity;

            EntityChangeType changeType;
            switch (entityEntry.State)
            {
                case EntityState.Added:
                    changeType = EntityChangeType.Create;
                    break;
                case EntityState.Deleted:
                    changeType = EntityChangeType.Delete;
                    break;
                case EntityState.Modified:
                    changeType = IsDeleted(entityEntry) ? EntityChangeType.Delete : EntityChangeType.Change;
                    break;
                case EntityState.Detached:
                case EntityState.Unchanged:
                default:
                    return null;
            }

            var entityId = GetEntityId(entity);
            if (entityId == null && changeType != EntityChangeType.Create)
            {
                return null;
            }

            var entityType = entity.GetType();
            var entityChangeInfo = new EntityChange
            {
                ChangeTime = Clock.Now,
                ChangeType = changeType,
                EntityEntry = entityEntry, // [NotMapped]
                EntityId = entityId,
                EntityTypeFullName = entityType.FullName,
                EntityTypeName = entityType.Name,
                EntityTypeTableName = entityEntry.Metadata.Relational().TableName,
                PropertyChanges = GetPropertyChanges(entityEntry)
            };

            return entityChangeInfo;
        }

        private DateTime GetChangeTime(EntityChange entityChange)
        {
            var entity = entityChange.EntityEntry.As<EntityEntry>().Entity;
            switch (entityChange.ChangeType)
            {
                case EntityChangeType.Create:
                    return (entity as ICreatedDateAuditableEntity)?.AACreatedDate ?? Clock.Now;
                case EntityChangeType.Delete:
                    return (entity as IUpdatedDateAuditableEntity)?.AAUpdatedDate ?? Clock.Now;
                case EntityChangeType.Change:
                    return (entity as IUpdatedDateAuditableEntity)?.AAUpdatedDate ?? Clock.Now;
                default:
                    return Clock.Now;
            }
        }

        private string GetEntityId(object entityAsObj)
        {
            return entityAsObj
                .GetType()
                .GetProperty("Id")
                ?
                .GetValue(entityAsObj)
                ?
                .ToJsonString();
        }

        /// <summary>
        /// Gets the property changes for this entry.
        /// </summary>
        private ICollection<EntityPropertyChange> GetPropertyChanges(EntityEntry entityEntry)
        {
            var propertyChanges = new List<EntityPropertyChange>();
            var properties = entityEntry.Metadata.GetProperties();
            var isCreated = IsCreated(entityEntry);
            var isDeleted = IsDeleted(entityEntry);

            foreach (var property in properties)
            {
                var propertyEntry = entityEntry.Property(property.Name);
                if (ShouldSavePropertyHistory(propertyEntry, isCreated || isDeleted))
                {
                    propertyChanges.Add(
                        new EntityPropertyChange
                        {
                            NewValue = isDeleted ? null : propertyEntry.CurrentValue.SafeToString(),
                            OriginalValue = isCreated ? null : propertyEntry.OriginalValue.SafeToString(),
                            PropertyName = property.Name,
                            PropertyTypeFullName = property.ClrType.FullName
                        });
                }
            }

            return propertyChanges;
        }

        private bool IsCreated(EntityEntry entityEntry)
        {
            return entityEntry.State == EntityState.Added;
        }

        private bool IsDeleted(EntityEntry entityEntry)
        {
            if (entityEntry.State == EntityState.Deleted)
            {
                return true;
            }

            var entity = entityEntry.Entity;
            return entity is IStatusableEntity && entity.As<IStatusableEntity>().AAStatus == EntityStatus.Delete;
        }

        private bool ShouldSaveEntityHistory(EntityEntry entityEntry, bool defaultValue = false)
        {
            if (entityEntry.State == EntityState.Detached ||
                entityEntry.State == EntityState.Unchanged)
            {
                return false;
            }

            var entityType = entityEntry.Entity.GetType();
            if (!EntityHelper.IsEntity(entityType))
            {
                return false;
            }

            if (!entityType.IsPublic)
            {
                return false;
            }

            if (entityType.GetTypeInfo().IsDefined(typeof(DisableEntityHistoryAttribute), true))
            {
                return false;
            }

            if (entityType.GetTypeInfo().IsDefined(typeof(EntityHistoryAttribute), true))
            {
                return true;
            }

            var properties = entityEntry.Metadata.GetProperties();
            if (properties.Any(p => p.PropertyInfo?.IsDefined(typeof(EntityHistoryAttribute)) ?? false))
            {
                return true;
            }

            return defaultValue;
        }

        private bool ShouldSavePropertyHistory(PropertyEntry propertyEntry, bool defaultValue)
        {
            var propertyInfo = propertyEntry.Metadata.PropertyInfo;
            if (propertyInfo.IsDefined(typeof(DisableEntityHistoryAttribute), true))
            {
                return false;
            }

            var classType = propertyInfo.DeclaringType;
            if (classType != null)
            {
                if (classType.GetTypeInfo().IsDefined(typeof(DisableEntityHistoryAttribute), true) &&
                    !propertyInfo.IsDefined(typeof(EntityHistoryAttribute), true))
                {
                    return false;
                }
            }

            var isModified = !(propertyEntry.OriginalValue?.Equals(propertyEntry.CurrentValue) ?? propertyEntry.CurrentValue == null);
            if (isModified)
            {
                return true;
            }

            return defaultValue;
        }

        /// <summary>
        /// Updates change time, entity id and foreign keys after SaveChanges is called.
        /// </summary>
        public void UpdateChangeSet(EntityChangeSet changeSet)
        {
            foreach (var entityChangeInfo in changeSet.EntityChanges)
            {
                /* Update change time */

                entityChangeInfo.ChangeTime = GetChangeTime(entityChangeInfo);

                /* Update entity id */

                var entityEntry = entityChangeInfo.EntityEntry.As<EntityEntry>();
                entityChangeInfo.EntityId = GetEntityId(entityEntry.Entity);

                /* Update foreign keys */

                var foreignKeys = entityEntry.Metadata.GetForeignKeys();

                foreach (var foreignKey in foreignKeys)
                {
                    foreach (var property in foreignKey.Properties)
                    {
                        var propertyEntry = entityEntry.Property(property.Name);
                        var propertyChange = entityChangeInfo.PropertyChanges.FirstOrDefault(pc => pc.PropertyName == property.Name);

                        if (propertyChange == null)
                        {
                            if (!(propertyEntry.OriginalValue?.Equals(propertyEntry.CurrentValue) ?? propertyEntry.CurrentValue == null))
                            {
                                // Add foreign key
                                entityChangeInfo.PropertyChanges.Add(
                                    new EntityPropertyChange
                                    {
                                        NewValue = propertyEntry.CurrentValue.SafeToString(),
                                        OriginalValue = propertyEntry.OriginalValue.SafeToString(),
                                        PropertyName = property.Name,
                                        PropertyTypeFullName = property.ClrType.FullName
                                    });
                            }

                            continue;
                        }

                        if (propertyChange.OriginalValue == propertyChange.NewValue)
                        {
                            var newValue = propertyEntry.CurrentValue.SafeToString();
                            if (newValue == propertyChange.NewValue)
                            {
                                // No change
                                entityChangeInfo.PropertyChanges.Remove(propertyChange);
                            }
                            else
                            {
                                // Update foreign key
                                propertyChange.NewValue = newValue;
                            }
                        }
                    }
                }
            }
        }
    }
}