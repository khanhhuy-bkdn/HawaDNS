using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.GE;
using _Entities.Interfaces;

namespace _Entities.AP
{
    [Table("APActors")]
    public class APActor : IFullEntity
    {
        public string AASource { get; set; }

        public string APActorName { get; set; }

        public string APActorAddress { get; set; }

        public string APActorTypeCode { get; set; }

        public int? FK_APActorTypeID { get; set; }

        public string APActorEmail { get; set; }

        public string APActorPhone { get; set; }

        public string APActorWebsite { get; set; }

        public string APActorAvatar { get; set; }

        public string APActorAcronymName { get; set; }

        public string APActorTaxNumber { get; set; }

        public string APActorRepresentative { get; set; }

        public string APActorFax { get; set; }

        public string APActorHouseNumber { get; set; }

        public int? FK_GEDistrictID { get; set; }

        public int? FK_GEStateProvinceID { get; set; }

        public int? FK_GECommuneID { get; set; }

        public string APActorIdentityCard { get; set; }

        public string APActorStatus { get; set; }

        public string GECommuneCode { get; set; }

        [ForeignKey("FK_GEStateProvinceID")] public virtual GEStateProvince GEStateProvince { get; set; }

        [ForeignKey("FK_GEDistrictID")] public virtual GEDistrict GEDistrict { get; set; }

        [ForeignKey("FK_GECommuneID")] public virtual GECommune GECommune { get; set; }

        [InverseProperty("APActor")] public virtual ICollection<APActorRole> APActorRoles { get; set; }

        [ForeignKey("FK_APActorTypeID")] public virtual APActorType APActorType { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("APActorID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string APActorCode { get; set; }

        public string GEDistrictCode { get; set; }

        public string GEStateProvinceCode { get; set; }
    }
}