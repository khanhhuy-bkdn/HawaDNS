using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace _EntityFrameworkCore.EntityHistory
{
    public class EntityChange : IEntity
    {
        /// <summary>
        /// ChangeTime.
        /// </summary>
        public virtual DateTime ChangeTime { get; set; }

        /// <summary>
        /// ChangeType.
        /// </summary>
        public virtual EntityChangeType ChangeType { get; set; }

        /// <summary>
        /// Gets/sets change set id, used to group entity changes.
        /// </summary>
        public virtual long EntityChangeSetId { get; set; }

        /// <summary>
        /// Gets/sets primary key of the entity.
        /// </summary>
        public virtual string EntityId { get; set; }

        /// <summary>
        /// Gets/sets entity no of the entity.
        /// </summary>
        public virtual string EntityNo { get; set; }

        /// <summary>
        /// FullName of the entity type.
        /// </summary>
        public virtual string EntityTypeFullName { get; set; }

        /// <summary>
        /// Name of the entity type.
        /// </summary>
        public virtual string EntityTypeName { get; set; }

        /// <summary>
        /// Table name of the entity type.
        /// </summary>
        public virtual string EntityTypeTableName { get; set; }

        /// <summary>
        /// PropertyChanges.
        /// </summary>
        public virtual ICollection<EntityPropertyChange> PropertyChanges { get; set; }

        #region Not mapped
        [NotMapped] public virtual EntityEntry EntityEntry { get; set; }
        #endregion

        public int Id { get; set; }
    }
}