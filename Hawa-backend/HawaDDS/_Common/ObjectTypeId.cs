using System.Linq;

using _Common.Extensions;
using _Common.Helpers;

namespace _Common
{
    public class ObjectTypeId
    {
        private const char IdSeperator = '_';

        public int? ObjectId { get; set; }

        public string ObjectType { get; set; }

        public static int GetObjectId(string objectTypeIdString)
        {
            return objectTypeIdString.IsNullOrWhiteSpace() ? 0 : objectTypeIdString.Split(IdSeperator).FirstOrDefault().ParseId();
        }

        public static string GetObjectType(string objectTypeIdString)
        {
            return objectTypeIdString.IsNullOrWhiteSpace() ? string.Empty : objectTypeIdString.Split(IdSeperator).LastOrDefault();
        }

        public static ObjectTypeId ToObjectTypeId(string objectTypeIdString)
        {
            if (objectTypeIdString.IsNullOrWhiteSpace())
            {
                return null;
            }

            return new ObjectTypeId
            {
                ObjectId = objectTypeIdString.Split(IdSeperator).FirstOrDefault().ParseId(),
                ObjectType = objectTypeIdString.Split(IdSeperator).LastOrDefault(),
            };
        }

        public override string ToString()
        {
            return string.Join(IdSeperator, ObjectId, ObjectType);
        }

        public ObjectTypeId(int? objectId, string objectType)
        {
            ObjectId = objectId;
            ObjectType = objectType;
        }

        public ObjectTypeId()
        {
        }
    }
}