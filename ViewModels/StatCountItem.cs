using System.Windows.Media;

namespace QalatAldhaman.Store.Admin.ViewModels;

/// <summary>عنصر عرض بسيط لبطاقة/سطر إحصائي: تسمية + عدد + لون اختياري.</summary>
public class StatCountItem
{
    public string Label { get; }
    public int Count { get; }
    public Brush Color { get; }

    public StatCountItem(string label, int count, Brush? color = null)
    {
        Label = label;
        Count = count;
        Color = color ?? Brushes.Black;
    }
}
