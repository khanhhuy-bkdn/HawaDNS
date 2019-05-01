namespace _Dtos.AR.InputDtos
{
    public class FilterContactsOfCommuneDto
    {
        public int CommuneId { get; set; }

        public string ContactStatus { get; set; }

        public string SearchTerm { get; set; }
    }
}