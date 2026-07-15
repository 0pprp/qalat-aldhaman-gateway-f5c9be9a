using System.Collections.ObjectModel;
using System.Net;
using System.Net.Http.Json;
using System.Windows;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using QalatAldhaman.Store.Admin.Models.Categories;
using QalatAldhaman.Store.Admin.Models.Orders;
using QalatAldhaman.Store.Admin.Services;
using QalatAldhaman.Store.Admin.Views;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class OrdersViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;

    public ObservableCollection<OrderRowViewModel> Orders { get; } = [];

    public ObservableCollection<CategoryDto> Categories { get; } = [];

    public List<FilterOption> StatusOptions { get; } =
    [
        new FilterOption(null, "كل الحالات"),
        .. OrderDisplay.StatusOptions.Select(s => new FilterOption(s.Value, s.Label)),
    ];

    public List<FilterOption> PurchaseMethodOptions { get; } =
    [
        new FilterOption(null, "كل طرق الدفع"),
        new FilterOption("Cash", "نقد"),
        new FilterOption("MonthlyInstallment", "قسط شهري"),
        new FilterOption("MonthlyRafidain", "قسط شهري - رافدين"),
        new FilterOption("DailyInstallment", "قسط يومي"),
    ];

    [ObservableProperty]
    private FilterOption? _selectedStatusFilter;

    [ObservableProperty]
    private FilterOption? _selectedPurchaseMethodFilter;

    [ObservableProperty]
    private CategoryDto? _selectedCategoryFilter;

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private bool _isError;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    public bool IsContentVisible => !IsLoading && !IsError;
    public bool IsEmpty => IsContentVisible && Orders.Count == 0;
    public bool HasOrders => IsContentVisible && Orders.Count > 0;

    public OrdersViewModel(ApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    partial void OnIsLoadingChanged(bool value)
    {
        OnPropertyChanged(nameof(IsContentVisible));
        OnPropertyChanged(nameof(IsEmpty));
        OnPropertyChanged(nameof(HasOrders));
    }

    partial void OnIsErrorChanged(bool value)
    {
        OnPropertyChanged(nameof(IsContentVisible));
        OnPropertyChanged(nameof(IsEmpty));
        OnPropertyChanged(nameof(HasOrders));
    }

    partial void OnSelectedStatusFilterChanged(FilterOption? value) => _ = LoadAsync();
    partial void OnSelectedPurchaseMethodFilterChanged(FilterOption? value) => _ = LoadAsync();
    partial void OnSelectedCategoryFilterChanged(CategoryDto? value) => _ = LoadAsync();

    public async Task InitializeAsync()
    {
        await LoadCategoriesAsync();
        await LoadAsync();
    }

    private async Task LoadCategoriesAsync()
    {
        try
        {
            var response = await _apiClient.GetAsync("/api/admin/categories");
            if (response.IsSuccessStatusCode)
            {
                var categories = await response.Content.ReadFromJsonAsync<List<CategoryDto>>(JsonDefaults.Options);
                Categories.Clear();
                foreach (var category in categories ?? [])
                {
                    Categories.Add(category);
                }
            }
        }
        catch (Exception)
        {
            // فشل تحميل الفئات هنا لا يمنع عرض الطلبات — فلتر الفئة يبقى فارغاً فقط.
        }
    }

    [RelayCommand]
    public async Task LoadAsync()
    {
        IsLoading = true;
        IsError = false;
        ErrorMessage = string.Empty;

        try
        {
            var query = new List<string>();
            if (SelectedStatusFilter?.Value is { } status) query.Add($"status={status}");
            if (SelectedPurchaseMethodFilter?.Value is { } method) query.Add($"purchaseMethod={method}");
            if (SelectedCategoryFilter is not null) query.Add($"categoryId={SelectedCategoryFilter.Id}");

            var uri = "/api/admin/orders" + (query.Count > 0 ? "?" + string.Join("&", query) : string.Empty);
            var response = await _apiClient.GetAsync(uri);

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                return;
            }

            if (response.IsSuccessStatusCode)
            {
                var orders = await response.Content.ReadFromJsonAsync<List<OrderListItemDto>>(JsonDefaults.Options);
                Orders.Clear();
                foreach (var order in orders ?? [])
                {
                    Orders.Add(new OrderRowViewModel(order));
                }
            }
            else
            {
                IsError = true;
                ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر تحميل الطلبات";
            }
        }
        catch (Exception)
        {
            IsError = true;
            ErrorMessage = "تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى";
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private void OpenOrder(OrderRowViewModel row)
    {
        var viewModel = new OrderDetailViewModel(_apiClient, row.Id);
        var dialog = new OrderDetailDialog(viewModel)
        {
            Owner = Application.Current.MainWindow,
        };

        dialog.ShowDialog();

        if (viewModel.WasStatusUpdated)
        {
            _ = LoadAsync();
        }
    }
}
