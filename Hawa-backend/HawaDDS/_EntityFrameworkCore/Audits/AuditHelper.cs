using System;

using _Common.Extensions;
using _Common.Runtime.Session;
using _Entites;
using _Entities;
using _Entities.Interfaces;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace _EntityFrameworkCore.Audits
{
    public class AuditHelper : IAuditHelper
    {
        private readonly IBysSession _bysSession;

        public AuditHelper(IBysSession bysSession)
        {
            _bysSession = bysSession;
        }

        public void ApplyBysConcepts(EntityEntry entry)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    ApplyBysConceptsForAddedEntity(entry);
                    break;
                case EntityState.Modified:
                    ApplyBysConceptsForModifiedEntity(entry);
                    break;
                case EntityState.Deleted:
                    ApplyBysConceptsForDeletedEntity(entry);
                    break;
            }
        }

        private void ApplyBysConceptsForAddedEntity(EntityEntry entry)
        {
            SetCreationStatusForStatusProperty(entry);
            SetCreationAuditProperties(entry.Entity);
        }

        private void ApplyBysConceptsForModifiedEntity(EntityEntry entry)
        {
            SetModificationAuditProperties(entry.Entity);
        }

        private void ApplyBysConceptsForDeletedEntity(EntityEntry entry)
        {
            CancelDeletionForSoftDelete(entry);
        }

        private void CancelDeletionForSoftDelete(EntityEntry entry)
        {
            if (!(entry.Entity is IStatusableEntity))
            {
                return;
            }

            entry.Reload();
            entry.State = EntityState.Modified;
            entry.Entity.As<IStatusableEntity>().AAStatus = EntityStatus.Delete;

            SetModificationAuditProperties(entry.Entity);
        }

        private static void SetCreationStatusForStatusProperty(EntityEntry entry)
        {
            if (entry.Entity is IStatusableEntity)
            {
                entry.Entity.As<IStatusableEntity>().AAStatus = EntityStatus.Alive;
            }
        }

        private void SetModificationAuditProperties(object entityAsObj)
        {
            if (entityAsObj is IUpdatedDateAuditableEntity)
            {
                entityAsObj.As<IUpdatedDateAuditableEntity>().AAUpdatedDate = DateTime.Now;
            }

            if (entityAsObj is IUpdatedUserAuditableEntity)
            {
                entityAsObj.As<IUpdatedUserAuditableEntity>().AAUpdatedUser = _bysSession.UserName;
            }
        }

        private void SetCreationAuditProperties(object entityAsObj)
        {
            if (entityAsObj is ICreatedDateAuditableEntity)
            {
                entityAsObj.As<ICreatedDateAuditableEntity>().AACreatedDate = DateTime.Now;
            }

            if (entityAsObj is ICreatedUserAuditableEntity)
            {
                entityAsObj.As<ICreatedUserAuditableEntity>().AACreatedUser = _bysSession.UserName;
            }
        }
    }
}