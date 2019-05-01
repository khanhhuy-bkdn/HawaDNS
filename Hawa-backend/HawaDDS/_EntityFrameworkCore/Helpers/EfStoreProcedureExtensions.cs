using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

using _Common.Extensions;

using Microsoft.EntityFrameworkCore;

namespace _EntityFrameworkCore.Helpers
{
    public static class EfStoreProcedureExtensions
    {
        public static DbCommand StoreProcedure(this DbContext context, string storedProcName, bool prependDefaultSchema = true)
        {
            var cmd = context.Database.GetDbConnection().CreateCommand();
            if (prependDefaultSchema)
            {
                var schemaName = context.Model.Relational().DefaultSchema;
                if (schemaName != null)
                {
                    storedProcName = $"{schemaName}.{storedProcName}";
                }
            }

            cmd.CommandText = storedProcName;
            cmd.CommandType = CommandType.StoredProcedure;
            return cmd;
        }

        public static DbCommand WithSqlParameter(this DbCommand cmd, string paramName)
        {
            return WithSqlParameter(cmd, paramName, DBNull.Value);
        }

        public static DbCommand WithSqlParameter(this DbCommand cmd, string paramName, object paramValue)
        {
            return WithSqlParameter(cmd, paramName, paramValue, null);
        }

        public static DbCommand WithSqlParameter(this DbCommand cmd, string paramName, object paramValue, Action<DbParameter> configureParam)
        {
            if (string.IsNullOrEmpty(cmd.CommandText) && cmd.CommandType != CommandType.StoredProcedure)
                throw new InvalidOperationException("Call LoadStoredProc before using this method");

            var param = cmd.CreateParameter();
            param.ParameterName = paramName.EnsureStartsWith("@");
            param.Value = paramValue ?? DBNull.Value;
            configureParam?.Invoke(param);
            cmd.Parameters.Add(param);
            return cmd;
        }

        public class SprocResults
        {
            //  private DbCommand _command;
            private DbDataReader _reader;

            public SprocResults(DbDataReader reader)
            {
                // _command = command;
                _reader = reader;
            }

            public IList<T> ReadToList<T>()
            {
                return MapToList<T>(_reader);
            }

            public T? ReadToValue<T>() where T : struct
            {
                return MapToValue<T>(_reader);
            }

            public Task<bool> NextResultAsync()
            {
                return _reader.NextResultAsync();
            }

            public Task<bool> NextResultAsync(CancellationToken ct)
            {
                return _reader.NextResultAsync(ct);
            }

            public bool NextResult()
            {
                return _reader.NextResult();
            }

            private IList<T> MapToList<T>(DbDataReader dr)
            {
                var result = new List<T>();
                var entityProperties = typeof(T).GetRuntimeProperties();

                var colMapping = dr.GetColumnSchema()
                    .Where(x => entityProperties.Any(y => y.Name.ToLower() == x.ColumnName.ToLower()))
                    .GroupBy(x => x.ColumnName)
                    .ToDictionary(key => key.Key, x => x.FirstOrDefault());

                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        T entity = Activator.CreateInstance<T>();
                        foreach (var prop in entityProperties)
                        {
                            if (colMapping.ContainsKey(prop.Name))
                            {
                                var val = dr.GetValue(colMapping[prop.Name].ColumnOrdinal.Value);
                                prop.SetValue(entity, val == DBNull.Value ? null : val);
                            }
                        }

                        result.Add(entity);
                    }
                }

                return result;
            }

            private T? MapToValue<T>(DbDataReader dr) where T : struct
            {
                if (dr.HasRows)
                {
                    if (dr.Read())
                    {
                        return dr.IsDBNull(0) ? new T?() : dr.GetFieldValue<T>(0);
                    }
                }

                return new T?();
            }
        }

        public static void ExecuteStoredProc(this DbCommand command, Action<SprocResults> handleResults, CommandBehavior commandBehaviour = CommandBehavior.Default)
        {
            if (handleResults == null)
            {
                throw new ArgumentNullException(nameof(handleResults));
            }

            using (command)
            {
                if (command.Connection.State == ConnectionState.Closed)
                    command.Connection.Open();
                try
                {
                    using (var reader = command.ExecuteReader(commandBehaviour))
                    {
                        var sprocResults = new SprocResults(reader);

                        // return new SprocResults();
                        handleResults(sprocResults);
                    }
                }
                finally
                {
                    command.Connection.Close();
                }
            }
        }

        public static async Task<IEnumerable<T>> ExecuteStpAsync<T>(this DbCommand command, CommandBehavior commandBehaviour = CommandBehavior.Default)
        {
            using (command)
            {
                if (command.Connection.State == ConnectionState.Closed)
                    command.Connection.Open();
                try
                {
                    using (var reader = await command.ExecuteReaderAsync(commandBehaviour))
                    {
                        var sprocResults = new SprocResults(reader);

                        return sprocResults.ReadToList<T>();
                    }
                }
                finally
                {
                    command.Connection.Close();
                }
            }
        }

        public static IList<T> ExecuteStpAndGetList<T>(this DbCommand command, CommandBehavior commandBehaviour = CommandBehavior.Default)
        {
            using (command)
            {
                if (command.Connection.State == ConnectionState.Closed)
                    command.Connection.Open();
                try
                {
                    using (var reader = command.ExecuteReader(commandBehaviour))
                    {
                        var sprocResults = new SprocResults(reader);

                        return sprocResults.ReadToList<T>();
                    }
                }
                finally
                {
                    command.Connection.Close();
                }
            }
        }

        public static TValue ExecuteStpAndGetSingleValue<TValue>(this DbCommand command, CommandBehavior commandBehaviour = CommandBehavior.Default)
        {
            using (command)
            {
                if (command.Connection.State == ConnectionState.Closed)
                    command.Connection.Open();
                try
                {
                    using (var reader = command.ExecuteReader(commandBehaviour))
                    {
                        TValue returnValue = default(TValue);
                        if (reader.HasRows)
                        {
                            if (reader.Read())
                            {
                                object columnValue = reader.GetValue(0);

                                if (!(columnValue is DBNull))
                                {
                                    returnValue = (TValue)Convert.ChangeType(columnValue, typeof(TValue));
                                }
                            }
                        }

                        return returnValue;
                    }
                }
                finally
                {
                    command.Connection.Close();
                }
            }
        }

        public static async Task ExecuteStoredProcAsync(this DbCommand command, Action<SprocResults> handleResults, CommandBehavior commandBehaviour = CommandBehavior.Default, CancellationToken ct = default(CancellationToken))
        {
            if (handleResults == null)
            {
                throw new ArgumentNullException(nameof(handleResults));
            }

            using (command)
            {
                if (command.Connection.State == ConnectionState.Closed)
                    await command.Connection.OpenAsync(ct).ConfigureAwait(false);
                try
                {
                    using (var reader = await command.ExecuteReaderAsync(commandBehaviour, ct).ConfigureAwait(false))
                    {
                        var sprocResults = new SprocResults(reader);
                        handleResults(sprocResults);
                    }
                }
                finally
                {
                    command.Connection.Close();
                }
            }
        }
    }
}