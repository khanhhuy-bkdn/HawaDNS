using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.AP
{
    [Table("APActorTypes")]
    public class APActorType : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("APActorTypeID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string AASource { get; set; }

        public string APActorTypeName { get; set; }

        public string APActorTypeCode { get; set; }

        public string APActorTypeAcronymName { get; set; }
    }
}