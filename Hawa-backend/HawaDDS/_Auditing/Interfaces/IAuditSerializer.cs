namespace _Auditing.Interfaces
{
    public interface IAuditSerializer
    {
        string Serialize(object obj);
    }
}