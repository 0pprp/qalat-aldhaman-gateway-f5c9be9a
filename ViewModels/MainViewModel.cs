using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using QalatAldhaman.Store.Admin.Services;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class MainViewModel : ObservableObject
{
    private readonly SessionService _sessionService;
    private readonly ApiClient _apiClient;
    private readonly CategoriesViewModel _categoriesViewModel;
    private readonly ProductsViewModel _productsViewModel;
    private readonly OrdersViewModel _ordersViewModel;
    private readonly ReviewsViewModel _reviewsViewModel;
    private readonly ContractsViewModel _contractsViewModel;
    private readonly DashboardViewModel _dashboardViewModel;

    public List<string> NavItems { get; } =
    [
        "الفئات",
        "المنتجات",
        "الطلبات",
        "الآراء",
        "عقود طرق الدفع",
        "الإحصائيات",
    ];

    [ObservableProperty]
    private string _selectedNavItem = "الفئات";

    /// <summary>محتوى منطقة الشاشة الرئيسية الحالي — عنصر واحد فقط بكل لحظة (راجع MainWindow.xaml: ContentControl وحيد + DataTemplates لكل نوع).</summary>
    [ObservableProperty]
    private object _currentViewModel;

    public string FullName => _sessionService.FullName ?? string.Empty;

    public MainViewModel(
        SessionService sessionService,
        ApiClient apiClient,
        CategoriesViewModel categoriesViewModel,
        ProductsViewModel productsViewModel,
        OrdersViewModel ordersViewModel,
        ReviewsViewModel reviewsViewModel,
        ContractsViewModel contractsViewModel,
        DashboardViewModel dashboardViewModel)
    {
        _sessionService = sessionService;
        _apiClient = apiClient;
        _categoriesViewModel = categoriesViewModel;
        _productsViewModel = productsViewModel;
        _ordersViewModel = ordersViewModel;
        _reviewsViewModel = reviewsViewModel;
        _contractsViewModel = contractsViewModel;
        _dashboardViewModel = dashboardViewModel;
        _currentViewModel = _categoriesViewModel;
    }

    partial void OnSelectedNavItemChanged(string value)
    {
        CurrentViewModel = value switch
        {
            "الفئات" => _categoriesViewModel,
            "المنتجات" => _productsViewModel,
            "الطلبات" => _ordersViewModel,
            "الآراء" => _reviewsViewModel,
            "عقود طرق الدفع" => _contractsViewModel,
            "الإحصائيات" => _dashboardViewModel,
            _ => new PlaceholderViewModel(value),
        };

        if (value == "الإحصائيات")
        {
            _ = _dashboardViewModel.LoadAsync();
        }
    }

    [RelayCommand]
    private void Logout()
    {
        _sessionService.Logout();
    }

    /// <summary>
    /// نداء محمي حقيقي عند فتح النافذة الرئيسية للتأكد أن الجلسة صالحة فعلياً (وليس فقط أن التوكن
    /// موجود بالذاكرة) — يمرّ عبر ApiClient فيُفعّل مسار اكتشاف 401 نفسه المُستخدم لاحقاً بأي شاشة حقيقية.
    /// أخطاء الشبكة تُتجاهل هنا عمداً (لا داعي لإزعاج المستخدم عند فتح النافذة لمجرد انقطاع مؤقت).
    /// </summary>
    public async Task VerifySessionAsync()
    {
        try
        {
            await _apiClient.GetAsync("/api/admin/auth/me");
        }
        catch
        {
            // يُترك بصمت: فشل الاتصال هنا لا يعني انتهاء الجلسة، فقط عدم القدرة على التحقق الآن.
        }
    }

    /// <summary>تحميل أولي لكل التبويبات الحقيقية دفعة واحدة عند فتح النافذة (بصرف النظر عن التبويب المعروض حالياً).</summary>
    public async Task LoadAllTabsAsync()
    {
        await _categoriesViewModel.LoadAsync();
        await _productsViewModel.InitializeAsync();
        await _ordersViewModel.InitializeAsync();
        await _reviewsViewModel.LoadAsync();
        await _contractsViewModel.LoadAsync();
        await _dashboardViewModel.LoadAsync();
    }
}
