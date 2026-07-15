namespace QalatAldhaman.Store.Admin.ViewModels;

/// <summary>تُعرض للتبويبات التي لم تُبنَ بعد (الطلبات، الآراء، الإحصائيات).</summary>
public class PlaceholderViewModel
{
    public string Title { get; }

    public PlaceholderViewModel(string title)
    {
        Title = title;
    }
}
