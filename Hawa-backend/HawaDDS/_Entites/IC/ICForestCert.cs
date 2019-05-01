using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.IC
{
    [Table("ICForestCerts")]
    public class ICForestCert : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ICForestCertID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string AASource { get; set; }

        public string ICForestCertName { get; set; }

        public string ICForestCertCode { get; set; }

        public string ICForestCertDesc { get; set; }
    }
}