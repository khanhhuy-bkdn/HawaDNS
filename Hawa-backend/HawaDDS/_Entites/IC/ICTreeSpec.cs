using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.IC
{
    [Table("ICTreeSpecs")]
    public class ICTreeSpec : IFullEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ICTreeSpecID")]
        public int Id { get; set; }

        [StringLength(10)] public string AAStatus { get; set; }

        public DateTime? AACreatedDate { get; set; }

        public string AACreatedUser { get; set; }

        public DateTime? AAUpdatedDate { get; set; }

        public string AAUpdatedUser { get; set; }

        public string AASource { get; set; }

        public string ICTreeSpecName { get; set; }

        public string ICTreeSpecAcronym { get; set; }

        public string ICTreeSpecLatin { get; set; }

        public string ICTreeSpecGeoDistribution { get; set; }

        public bool? ICTreeSpecIsSpecialProduct { get; set; }

        public int? FK_ICTreeSpecGroupID { get; set; }

        public int? ICTreeSpecsSortOrder { get; set; }

        [InverseProperty("ICTreeSpec")] public virtual ICollection<ICTreeSpecGroupItem> ICTreeSpecGroupItems { get; set; }

        [InverseProperty("ICTreeSpec")] public ICollection<ICForestPlot> ICForestPlots { get; set; }
    }
}