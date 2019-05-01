using System;
using System.Linq;
using System.Reflection;

using _Entities.Interfaces;

namespace _Entities
{
    /// <summary>
    /// Some helper methods for entities.
    /// </summary>
    public static class EntityHelper
    {
        public static bool IsEntity(Type type)
        {
            return type.GetInterfaces().Contains(typeof(IEntity));
        }

        public static Type GetPrimaryKeyType<TEntity>()
        {
            return GetPrimaryKeyType(typeof(TEntity));
        }

        /// <summary>
        /// Gets primary key type of given entity type
        /// </summary>
        public static Type GetPrimaryKeyType(Type entityType)
        {
            foreach (var interfaceType in entityType.GetTypeInfo().GetInterfaces())
            {
                if (interfaceType.GetTypeInfo().IsGenericType && interfaceType.GetGenericTypeDefinition() == typeof(IEntity))
                {
                    return interfaceType.GenericTypeArguments[0];
                }
            }

            throw new Exception("Can not find primary key type of given entity type: " + entityType + ". Be sure that this entity type implements IEntity<TPrimaryKey> interface");
        }

        public static void CopyTo(this IEntity source, IEntity destination)
        {
            string sourceTypeName = source.GetType().Name;
            string destinationTypeName = destination.GetType().Name;

            var properties = destination.GetType().GetProperties();

            foreach (PropertyInfo propertyInfo in properties)
            {
                if (propertyInfo.Name != "Id" && propertyInfo.Name != "IsTransferred" && !propertyInfo.Name.Contains("TransferredDate"))
                {
                    string name1 = string.Empty;
                    if (propertyInfo.Name.StartsWith(destinationTypeName, StringComparison.Ordinal))
                    {
                        name1 = sourceTypeName + propertyInfo.Name.Substring(destinationTypeName.Length);
                    }

                    PropertyInfo property1 = source.GetType().GetProperty(name1);
                    if (property1 != null)
                    {
                        object obj = property1.GetValue(source, null);
                        propertyInfo.SetValue(destination, obj, null);
                    }
                    else
                    {
                        string name2 = destinationTypeName.Substring(0, 2) + propertyInfo.Name.Substring(2);
                        PropertyInfo property2 = source.GetType().GetProperty(name2);
                        if (property2 != null)
                        {
                            object obj = property2.GetValue(source, null);
                            propertyInfo.SetValue(destination, obj, null);
                        }
                        else
                        {
                            PropertyInfo property3 = source.GetType().GetProperty(propertyInfo.Name);
                            if (property3 != null)
                            {
                                object obj = property3.GetValue(source, null);
                                propertyInfo.SetValue(destination, obj, null);
                            }
                        }
                    }
                }
            }
        }

        public static TEntity CloneTo<TEntity>(this IEntity source) where TEntity : IEntity
        {
            var entity = (TEntity)Activator.CreateInstance(typeof(TEntity));

            source.CopyTo(entity);

            return entity;
        }
    }
}