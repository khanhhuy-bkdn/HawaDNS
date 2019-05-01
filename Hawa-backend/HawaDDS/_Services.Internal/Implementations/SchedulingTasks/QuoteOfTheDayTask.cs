using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

using _Common.Scheduling;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace _Services.Internal.Implementations.SchedulingTasks
{
    // uses https://theysaidso.com/api/
    public class QuoteOfTheDayTask : IScheduledTask
    {
        public string Schedule => "* */6 * * *";

        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            var httpClient = new HttpClient();

            var quoteJson = JObject.Parse(await httpClient.GetStringAsync("http://quotes.rest/qod.json"));

            QuoteOfTheDay.Current = JsonConvert.DeserializeObject<QuoteOfTheDay>(quoteJson["contents"]["quotes"][0].ToString());
        }
    }

    public class QuoteOfTheDay
    {
        public static QuoteOfTheDay Current { get; set; }

        static QuoteOfTheDay()
        {
            Current = new QuoteOfTheDay
            {
                Quote = "No quote",
                Author = "Maarten"
            };
        }

        public string Quote { get; set; }

        public string Author { get; set; }
    }
}