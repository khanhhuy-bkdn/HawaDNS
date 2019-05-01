using System;
using System.Linq;
using System.Linq.Expressions;

using _Entities.AP;
using _Entities.IC;
using _EntityFrameworkCore.Helpers.Linq;

namespace _EntityFrameworkCore.Helpers
{
    /// <summary>
    /// More details on lazy loading / eager loading here: http://msdn.microsoft.com/en-us/data/jj574232.aspx
    /// 
    /// Often methods `ToEntity` will use nested tables or just call nested `ToSubEntity`, which will result in additional LazyLoad requests. 
    /// Such behavior impacts performance and should be prevented.
    ///
    /// Primary reason for this class is to provide single point where Includes for eager-loading will be defined.
    /// These extensions should be used whenever ConvertHelper's `ToEntity()` methods will be used as a result of a query to database.
    /// </summary>
    public static class IncludeHelper
    {
        public static IQueryable<TEntity> IncludesForToForestPlot<TEntity>(this IQueryable<TEntity> query, Expression<Func<TEntity, ICForestPlot>> entityExpression) where TEntity : class
        {
            return query
                .Includes(entityExpression, x => x.GEDistrict)
                .Includes(entityExpression, x => x.GECommunes)
                .Includes(entityExpression, x => x.GEStateProvince)
                .Includes(entityExpression, x => x.GESubCompartment)
                .Includes(entityExpression, x => x.GECompartment);
        }

        public static IQueryable<TEntity> IncludesForToActor<TEntity>(this IQueryable<TEntity> query, Expression<Func<TEntity, APActor>> entityExpression) where TEntity : class
        {
            return query
                .Includes(entityExpression, x => x.GEDistrict)
                .Includes(entityExpression, x => x.GECommune)
                .Includes(entityExpression, x => x.APActorType)
                .Includes(entityExpression, x => x.GEStateProvince)
                .Includes(entityExpression, x => x.APActorRoles);
        }
    }
}