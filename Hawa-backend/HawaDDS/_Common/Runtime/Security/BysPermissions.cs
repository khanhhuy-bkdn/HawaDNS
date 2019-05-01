namespace _Common.Runtime.Security
{
    public class BysPermissions
    {
        public static readonly string ManageBidOpportunitys = "ManageBidOpportunitys";
        public static readonly string ViewBidOpportunitys = "ViewBidOpportunitys";
        public static readonly string ViewtBidOpportunityDetail = "ViewtBidOpportunityDetail";
        public static readonly string CreateBidOpportunity = "CreateBidOpportunity";
        public static readonly string EditBidOpportunity = "EditBidOpportunity";
        public static readonly string DeleteBidOpportunity = "DeleteBidOpportunity";

        public static readonly string[] AllPermissions =
        {
            ManageBidOpportunitys,
            ViewBidOpportunitys,
            ViewtBidOpportunityDetail,
            CreateBidOpportunity,
            EditBidOpportunity,
            DeleteBidOpportunity,
        };
    };
}