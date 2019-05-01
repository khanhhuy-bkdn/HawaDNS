using System.Collections.Generic;

namespace _Common.Extensions.TreeView
{
    public class TreeViewItem<T>
    {
        public T Item { get; set; }

        public IEnumerable<TreeViewItem<T>> Children { get; set; }
    }
}