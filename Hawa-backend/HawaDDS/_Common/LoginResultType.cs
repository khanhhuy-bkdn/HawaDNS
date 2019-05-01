namespace _Common
{
    public enum LoginResultType : byte
    {
        Success = 1,

        InvalidUserNameOrPassword,

        UserIsNotActive,

        UserLockout,

        UserIsNotEmailConfirm,

        UserIsNotVerifyByAdmin
    }
}