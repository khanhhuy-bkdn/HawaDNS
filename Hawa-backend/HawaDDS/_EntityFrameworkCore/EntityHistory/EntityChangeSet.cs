using System;
using System.Collections.Generic;

namespace _EntityFrameworkCore.EntityHistory
{
    public class EntityChangeSet
    {
        /// <summary>
        /// Creation time of this entity.
        /// </summary>
        public virtual DateTime CreationTime { get; set; }

        /// <summary>
        /// UserId.
        /// </summary>
        public virtual int? UserId { get; set; }

        /// <summary>
        /// UserName.
        /// </summary>
        public virtual string UserName { get; set; }

        /// <summary>
        /// Entity changes grouped in this change set.
        /// </summary>
        public virtual IList<EntityChange> EntityChanges { get; set; }

        public EntityChangeSet()
        {
            EntityChanges = new List<EntityChange>();
        }
    }
}