﻿using System;

using _Common.Extensions;

namespace _Common.Authorization
{
    /// <summary>
    /// Represents a permission.
    /// A permission is used to restrict functionalities of the application from unauthorized users.
    /// </summary>
    public sealed class Permission
    {
        /// <summary>
        /// Parent of this permission if one exists.
        /// If set, this permission can be granted only if parent is granted.
        /// </summary>
        public Permission Parent { get; private set; }

        /// <summary>
        /// Unique name of the permission.
        /// This is the key name to grant permissions.
        /// </summary>
        public string Name { get; }

        /// <summary>
        /// Display name of the permission.
        /// This can be used to show permission to the user.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// A brief description for this permission.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// List of child permissions. A child permission can be granted only if parent is granted.
        /// </summary>
        public Permission[] Children => _children;

        private readonly Permission[] _children;

        /// <summary>
        /// Creates a new Permission.
        /// </summary>
        /// <param name="name">Unique name of the permission</param>
        /// <param name="displayName">Display name of the permission</param>
        /// <param name="description">A brief description for this permission</param>
        public Permission(
            string name,
            string displayName = null,
            string description = null)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));

            DisplayName = displayName;
            Description = description;

            _children = EmptyArray<Permission>.Instance;
        }

        /// <summary>
        /// Adds a child permission.
        /// A child permission can be granted only if parent is granted.
        /// </summary>
        /// <returns>Returns newly created child permission</returns>
        public Permission CreateChildPermission(
            string name,
            string displayName = null,
            string description = null)
        {
            var permission = new Permission(name, displayName, description)
            {
                Parent = this
            };

            _children.AddIfNotContains(permission);

            return permission;
        }

        public override string ToString()
        {
            return string.Format("[Permission: {0}]", Name);
        }
    }
}