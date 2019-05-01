using System.Threading;
using System.Threading.Tasks;

namespace _Common.Scheduling
{
    public interface IScheduledTask
    {
        string Schedule { get; }

        Task ExecuteAsync(CancellationToken cancellationToken);
    }
}