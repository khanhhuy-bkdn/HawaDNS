using System;

namespace _Entities.Attributes
{
    /// <summary>
    /// This attribute is used to apply history logging for a db entities 
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method | AttributeTargets.Property)]
    public class DisableEntityHistoryAttribute : Attribute
    {
    }
}