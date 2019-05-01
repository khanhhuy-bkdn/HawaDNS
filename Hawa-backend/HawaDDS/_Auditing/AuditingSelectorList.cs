using System.Collections.Generic;

using _Auditing.Interfaces;
using _Common;

namespace _Auditing
{
    internal class AuditingSelectorList : List<NamedTypeSelector>, IAuditingSelectorList
    {
        public bool RemoveByName(string name)
        {
            return RemoveAll(s => s.Name == name) > 0;
        }
    }
}