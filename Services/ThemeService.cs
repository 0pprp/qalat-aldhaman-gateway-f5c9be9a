using System.IO;
using System.Linq;
using System.Text.Json;
using System.Windows;
using MaterialDesignThemes.Wpf;

namespace QalatAldhaman.Store.Admin.Services;

/// <summary>
/// يبدّل بين الوضع الفاتح والداكن وقت التشغيل: يستبدل قاموس Styles/Theme.Light.xaml أو
/// Styles/Theme.Dark.xaml بالآخر داخل Application.Resources.MergedDictionaries (كل مستهلكي
/// ألوان العلامة "المتغيّرة" — الخلفية/السطح/الحدود/النص — يستخدمون DynamicResource فيتحدّثون
/// فوراً)، بالإضافة لتطبيق نفس الوضع على القالب الداخلي لـ MaterialDesignThemes عبر PaletteHelper.
/// يحفظ التفضيل بملف JSON بسيط بجانب ملف التطبيق التنفيذي ليُستعاد تلقائياً بالمرة القادمة.
/// </summary>
public class ThemeService
{
    private const string SettingsFileName = "theme.settings.json";
    private static string SettingsPath => Path.Combine(AppContext.BaseDirectory, SettingsFileName);

    private readonly PaletteHelper _paletteHelper = new();

    public bool IsDarkTheme { get; private set; }

    public void Initialize()
    {
        IsDarkTheme = LoadPreference();
        Apply(IsDarkTheme);
    }

    public void ToggleTheme()
    {
        SetTheme(!IsDarkTheme);
    }

    public void SetTheme(bool isDark)
    {
        IsDarkTheme = isDark;
        Apply(isDark);
        SavePreference(isDark);
    }

    private void Apply(bool isDark)
    {
        var theme = _paletteHelper.GetTheme();
        theme.SetBaseTheme(isDark ? BaseTheme.Dark : BaseTheme.Light);
        _paletteHelper.SetTheme(theme);

        var dictionaries = Application.Current.Resources.MergedDictionaries;
        var newDictionary = new ResourceDictionary
        {
            Source = new Uri(
                isDark ? "Styles/Theme.Dark.xaml" : "Styles/Theme.Light.xaml",
                UriKind.Relative),
        };

        var existing = dictionaries.FirstOrDefault(d =>
            d.Source is not null &&
            (d.Source.OriginalString.EndsWith("Theme.Light.xaml", StringComparison.OrdinalIgnoreCase) ||
             d.Source.OriginalString.EndsWith("Theme.Dark.xaml", StringComparison.OrdinalIgnoreCase)));

        if (existing is not null)
        {
            var index = dictionaries.IndexOf(existing);
            dictionaries.RemoveAt(index);
            dictionaries.Insert(index, newDictionary);
        }
        else
        {
            dictionaries.Add(newDictionary);
        }
    }

    private static bool LoadPreference()
    {
        try
        {
            if (File.Exists(SettingsPath))
            {
                var json = File.ReadAllText(SettingsPath);
                var settings = JsonSerializer.Deserialize<ThemeSettings>(json);
                return settings?.IsDark ?? false;
            }
        }
        catch
        {
            // ملف تفضيلات تالف أو غير قابل للقراءة — نعتمد الوضع الفاتح الافتراضي بصمت.
        }

        return false;
    }

    private static void SavePreference(bool isDark)
    {
        try
        {
            var json = JsonSerializer.Serialize(new ThemeSettings { IsDark = isDark });
            File.WriteAllText(SettingsPath, json);
        }
        catch
        {
            // فشل حفظ التفضيل لا يوقف التطبيق — فقط لن يُستعاد التفضيل بالمرة القادمة.
        }
    }

    private class ThemeSettings
    {
        public bool IsDark { get; set; }
    }
}
