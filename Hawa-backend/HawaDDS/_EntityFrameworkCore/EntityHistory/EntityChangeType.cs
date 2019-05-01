namespace _EntityFrameworkCore.EntityHistory
{
    public enum EntityChangeType : byte
    {
        Create = 0,
        Change = 1,
        Delete = 2
    }
}