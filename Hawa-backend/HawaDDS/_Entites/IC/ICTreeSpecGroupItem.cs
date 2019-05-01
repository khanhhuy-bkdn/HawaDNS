using System;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.IC
{
    [Table("ICTreeSpecGroupItems")]
    public class ICTreeSpecGroupItem : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ICTreeSpecGroupItemID")]
        public int Id { get; set; }

        public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public int FK_ICTreeSpecGroupID { get; set; }

        public int FK_ICTreeSpecID { get; set; }

        [ForeignKey("FK_ICTreeSpecGroupID")] public virtual ICTreeSpecGroup ICTreeSpecGroup { get; set; }

        [ForeignKey("FK_ICTreeSpecID")] public virtual ICTreeSpec ICTreeSpec { get; set; }
    }
}