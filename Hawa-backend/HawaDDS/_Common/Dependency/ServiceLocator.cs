using System;

namespace _Common.Dependency
{
    /// <summary>
    /// This class provides the ambient container for this application. If your
    /// framework defines such an ambient container, use ServiceLocator.Current
    /// to get it.
    /// </summary>
    public static class ServiceLocator
    {
        private static ServiceLocatorProvider _currentProvider;

        /// <summary>
        /// The current ambient container.
        /// </summary>
        public static IServiceProvider Current
        {
            get
            {
                if (!IsLocationProviderSet)
                    throw new InvalidOperationException(nameof(_currentProvider));

                return _currentProvider();
            }
        }

        /// <summary>
        /// Set the delegate that is used to retrieve the current container.
        /// </summary>
        /// <param name="newProvider">Delegate that, when called, will return
        /// the current ambient container.</param>
        public static void SetLocatorProvider(ServiceLocatorProvider newProvider)
        {
            _currentProvider = newProvider;
        }

        public static bool IsLocationProviderSet => _currentProvider != null;
    }
}