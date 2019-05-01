using System;
using System.ComponentModel.DataAnnotations.Schema;

using _Entities.Interfaces;

namespace _Entities.AD
{
    [Table("ADUserTokens")]
    public class ADUserToken : IEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ADUserTokenID")]
        public int Id { get; set; }

        public int FK_ADUserId { get; set; }

        public string ADUserTokenValue { get; set; }

        public string ADUserTokenPurpose { get; set; }

        public DateTime ADUserTokenExpire { get; set; }
    }
}