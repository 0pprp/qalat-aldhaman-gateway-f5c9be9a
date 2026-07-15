using System.Windows.Media;

namespace QalatAldhaman.Store.Admin.ViewModels;

/// <summary>ترجمة أسماء enum القادمة من الباك اند (بالإنجليزية) لنصوص وألوان عربية جاهزة للعرض.</summary>
public static class OrderDisplay
{
    public static readonly (string Value, string Label)[] StatusOptions =
    [
        ("Pending", "قيد الانتظار"),
        ("ContactedByRep", "تم التواصل مع المندوب"),
        ("Confirmed", "مؤكد"),
        ("Rejected", "مرفوض"),
        ("Completed", "مكتمل"),
    ];

    private static readonly Dictionary<string, string> PurchaseMethodNames = new()
    {
        ["Cash"] = "نقد",
        ["MonthlyInstallment"] = "قسط شهري",
        ["MonthlyRafidain"] = "قسط شهري - رافدين",
        ["DailyInstallment"] = "قسط يومي",
    };

    public static string PurchaseMethodName(string value) => PurchaseMethodNames.GetValueOrDefault(value, value);

    public static string StatusName(string value) =>
        StatusOptions.FirstOrDefault(s => s.Value == value).Label is { Length: > 0 } label ? label : value;

    public static Brush StatusColor(string status) => status switch
    {
        "Pending" => new SolidColorBrush(Color.FromRgb(0xB8, 0x86, 0x0B)),
        "ContactedByRep" => new SolidColorBrush(Color.FromRgb(0x2E, 0x74, 0xB5)),
        "Confirmed" => new SolidColorBrush(Color.FromRgb(0x1E, 0x7E, 0x34)),
        "Rejected" => new SolidColorBrush(Color.FromRgb(0xC0, 0x39, 0x2B)),
        "Completed" => new SolidColorBrush(Color.FromRgb(0x17, 0x40, 0x3D)),
        _ => Brushes.Black,
    };
}
