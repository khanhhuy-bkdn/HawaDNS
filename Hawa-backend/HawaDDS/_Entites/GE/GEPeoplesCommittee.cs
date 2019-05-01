using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.GE
{
    [Table("GEPeoplesCommittees")]
    public class GEPeoplesCommittee : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("GEPeoplesCommitteeID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string AASource { get; set; }

        public string GEPeoplesCommitteeCode { get; set; }

        public string GEPeoplesCommitteeName { get; set; }

        public string GEPeoplesCommitteeDesc { get; set; }

        public string GEPeoplesCommitteePhone { get; set; }

        public string GEPeoplesCommitteePhone2 { get; set; }

        public string GEPeoplesCommitteeAddress { get; set; }

        public string GECommuneCode { get; set; }

        public int? FK_GECommuneID { get; set; }
    }
}