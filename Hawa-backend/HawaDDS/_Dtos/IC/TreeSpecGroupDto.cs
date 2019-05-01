namespace _Dtos.IC
{
    public class TreeSpecGroupDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Desc { get; set; }

        public TreeSpecDto[] TreeSpecs { get; set; }

        public long CreatedDate { get; set; }
    }
}