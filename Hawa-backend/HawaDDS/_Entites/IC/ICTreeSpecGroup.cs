using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.IC
{
    [Table("ICTreeSpecGroups")]
    public class ICTreeSpecGroup : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ICTreeSpecGroupID")]
        public int Id { get; set; }

        public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string ICTreeSpecGroupName { get; set; }

        public string ICTreeSpecGroupDesc { get; set; }

        [InverseProperty("ICTreeSpecGroup")] public virtual ICollection<ICTreeSpecGroupItem> ICTreeSpecGroupItems { get; set; }
    }
}