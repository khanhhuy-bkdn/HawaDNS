using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Bys.Entities.Interfaces;

namespace Bys.Entities.GE
{
    [Table("GECompartments")]
    public class GECompartment : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("GECompartmentID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string AASource { get; set; }

        public string GEProvinceCode { get; set; }

        public string GEDistrictCode { get; set; }

        public string GECommuneCode { get; set; }

        public string GECompartmentName { get; set; }

        public string GECompartmentCode { get; set; }

        public string GECompartmentDesc { get; set; }

        public int? FK_GECommuneID { get; set; }
    }
}