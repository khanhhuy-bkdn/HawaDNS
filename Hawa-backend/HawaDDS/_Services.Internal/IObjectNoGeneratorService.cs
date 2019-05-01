using _Entities.Interfaces;

namespace _Services.Internal
{
    public interface IObjectNoGeneratorService
    {
        string GenerateObjectNo<TEntity>(string moduleName) where TEntity : class, IEntity;

        string GenerateObjectNoWithYear<TEntity>(string moduleName) where TEntity : class, IEntity;
    }
}