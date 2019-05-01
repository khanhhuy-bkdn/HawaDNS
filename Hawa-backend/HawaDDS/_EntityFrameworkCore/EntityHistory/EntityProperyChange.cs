namespace _EntityFrameworkCore.EntityHistory
{
    public class EntityPropertyChange
    {
        /// <summary>
        /// EntityChangeId.
        /// </summary>
        public virtual long EntityChangeId { get; set; }

        /// <summary>
        /// NewValue.
        /// </summary>
        public virtual string NewValue { get; set; }

        /// <summary>
        /// OriginalValue.
        /// </summary>
        public virtual string OriginalValue { get; set; }

        /// <summary>
        /// PropertyName.
        /// </summary>
        public virtual string PropertyName { get; set; }

        /// <summary>
        /// Type of the JSON serialized <see cref="NewValue"/> and <see cref="OriginalValue"/>.
        /// It's the FullName of the type.
        /// </summary>
        public virtual string PropertyTypeFullName { get; set; }
    }
}