using System.Threading;
using System.Threading.Tasks;

using _Common.Scheduling;

namespace _Services.Internal.Implementations.SchedulingTasks
{
    public class SomeOtherTask : IScheduledTask
    {
        public string Schedule => "0 5 * * *";

        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            await Task.Delay(5000, cancellationToken);
        }
    }
}