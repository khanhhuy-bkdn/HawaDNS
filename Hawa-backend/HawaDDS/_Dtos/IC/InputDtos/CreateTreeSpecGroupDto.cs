namespace _Dtos.IC.InputDtos
{
    public class CreateTreeSpecGroupDto
    {
        public string Name { get; set; }

        public string Desc { get; set; }

        public int[] TreeSpecIds { get; set; }
    }
}