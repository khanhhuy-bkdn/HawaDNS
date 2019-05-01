using System;
using System.Collections.Generic;
using System.Linq;

namespace _Common.Extensions.TreeView
{
    public static class TreeViewExtension
    {
        /// <summary>
        /// Generates tree of items from item list
        /// </summary>
        /// 
        /// <typeparam name="T">Type of item in collection</typeparam>
        /// <typeparam name="K">Type of parent_id</typeparam>
        /// 
        /// <param name="collection">Collection of items</param>
        /// <param name="idSelector">Function extracting item's id</param>
        /// <param name="parentIdSelector">Function extracting item's parent_id</param>
        /// <param name="root_id">Root element id</param>
        /// 
        /// <returns>Tree of items</returns>
        public static IEnumerable<TreeViewItem<T>> GenerateTree<T, K>(
            this IEnumerable<T> collection,
            Func<T, K> idSelector,
            Func<T, K> parentIdSelector,
            K root_id = default(K))
        {
            return collection
                .Where(c => parentIdSelector(c).Equals(root_id))
                .Select(
                    c => new TreeViewItem<T>
                    {
                        Item = c,
                        Children = collection.GenerateTree(idSelector, parentIdSelector, idSelector(c))
                    });
        }
    }
}