using System.Globalization;
using System.Windows.Data;
using MaterialDesignThemes.Wpf;

namespace QalatAldhaman.Store.Admin.Converters;

/// <summary>يحوّل تسمية عنصر التنقل بالـ Sidebar (نص عربي) لأيقونة MaterialDesign مناسبة — تصميم بحت، لا منطق وظيفي.</summary>
public class NavIconConverter : IValueConverter
{
    private static readonly Dictionary<string, PackIconKind> IconMap = new()
    {
        ["الفئات"] = PackIconKind.ShapeOutline,
        ["المنتجات"] = PackIconKind.PackageVariantClosed,
        ["الطلبات"] = PackIconKind.ClipboardListOutline,
        ["الآراء"] = PackIconKind.StarOutline,
        ["عقود طرق الدفع"] = PackIconKind.FileDocumentOutline,
        ["الإحصائيات"] = PackIconKind.ChartBar,
    };

    public object Convert(object? value, Type targetType, object? parameter, CultureInfo culture) =>
        value is string label && IconMap.TryGetValue(label, out var kind) ? kind : PackIconKind.Circle;

    public object ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture) =>
        throw new NotSupportedException();
}
