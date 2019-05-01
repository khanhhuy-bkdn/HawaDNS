using System;
using System.Collections.Generic;

using _Auditing.Interfaces;

namespace _Auditing.Implementations
{
    public class AuditingConfiguration : IAuditingConfiguration
    {
        public bool IsEnabled { get; set; }

        public bool RunInBackground { get; set; }

        public bool IsEnabledForAnonymousUsers { get; set; }

        public IAuditingSelectorList Selectors { get; }

        public List<Type> IgnoredTypes { get; }

        public AuditingConfiguration()
        {
            IsEnabled = true;
            Selectors = new AuditingSelectorList();
            IgnoredTypes = new List<Type>();
            RunInBackground = false;
            IsEnabledForAnonymousUsers = true;
        }
    }
}