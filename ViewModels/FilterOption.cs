namespace QalatAldhaman.Store.Admin.ViewModels;

/// <summary>خيار فلترة بسيط: قيمة تُرسَل للباك اند (null/فارغة = بدون فلترة) + تسمية عربية للعرض.</summary>
public class FilterOption
{
    public string? Value { get; }
    public string Label { get; }

    public FilterOption(string? value, string label)
    {
        Value = value;
        Label = label;
    }
}
