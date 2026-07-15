using System.Collections.ObjectModel;
using System.Net;
using System.Net.Http.Json;
using System.Windows;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using QalatAldhaman.Store.Admin.Models.Dashboard;
using QalatAldhaman.Store.Admin.Services;
using QalatAldhaman.Store.Admin.Views;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class DashboardViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;

    public ObservableCollection<StatCountItem> StatusCounts { get; } = [];
    public ObservableCollection<StatCountItem> CategoryCounts { get; } = [];
    public ObservableCollection<StatCountItem> PurchaseMethodCounts { get; } = [];
    public ObservableCollection<RecentOrderRowViewModel> RecentOrders { get; } = [];

    [ObservableProperty]
    private int _totalOrders;

    [ObservableProperty]
    private int _ordersLast7Days;

    [ObservableProperty]
    private int _ordersLast30Days;

    [ObservableProperty]
    private string _estimatedConfirmedRevenueText = string.Empty;

    [ObservableProperty]
    private int _pendingReviewsCount;

    [ObservableProperty]
    private int _activeProductsCount;

    [ObservableProperty]
    private int _activeCategoriesCount;

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private bool _isError;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    public bool IsContentVisible => !IsLoading && !IsError;

    public DashboardViewModel(ApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    partial void OnIsLoadingChanged(bool value) => OnPropertyChanged(nameof(IsContentVisible));
    partial void OnIsErrorChanged(bool value) => OnPropertyChanged(nameof(IsContentVisible));

    [RelayCommand]
    public async Task LoadAsync()
    {
        IsLoading = true;
        IsError = false;
        ErrorMessage = string.Empty;

        try
        {
            var response = await _apiClient.GetAsync("/api/admin/dashboard/stats");

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                return;
            }

            if (response.IsSuccessStatusCode)
            {
                var stats = await response.Content.ReadFromJsonAsync<DashboardStatsDto>(JsonDefaults.Options);
                if (stats is not null)
                {
                    ApplyStats(stats);
                }
            }
            else
            {
                IsError = true;
                ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر تحميل الإحصائيات";
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

    private void ApplyStats(DashboardStatsDto stats)
    {
        TotalOrders = stats.TotalOrders;
        OrdersLast7Days = stats.OrdersLast7Days;
        OrdersLast30Days = stats.OrdersLast30Days;
        EstimatedConfirmedRevenueText = $"{stats.EstimatedConfirmedRevenue:N0} د.ع";
        PendingReviewsCount = stats.PendingReviewsCount;
        ActiveProductsCount = stats.ActiveProductsCount;
        ActiveCategoriesCount = stats.ActiveCategoriesCount;

        StatusCounts.Clear();
        foreach (var (value, label) in OrderDisplay.StatusOptions)
        {
            var count = stats.OrdersByStatus.GetValueOrDefault(value, 0);
            StatusCounts.Add(new StatCountItem(label, count, OrderDisplay.StatusColor(value)));
        }

        CategoryCounts.Clear();
        foreach (var category in stats.OrdersByCategory)
        {
            CategoryCounts.Add(new StatCountItem(category.CategoryName, category.OrderCount));
        }

        PurchaseMethodCounts.Clear();
        foreach (var (key, count) in stats.OrdersByPurchaseMethod)
        {
            PurchaseMethodCounts.Add(new StatCountItem(OrderDisplay.PurchaseMethodName(key), count));
        }

        RecentOrders.Clear();
        foreach (var order in stats.RecentOrders)
        {
            RecentOrders.Add(new RecentOrderRowViewModel(order));
        }
    }

    [RelayCommand]
    private void OpenOrder(RecentOrderRowViewModel row)
    {
        var viewModel = new OrderDetailViewModel(_apiClient, row.Id);
        var dialog = new OrderDetailDialog(viewModel)
        {
            Owner = Application.Current.MainWindow,
        };

        dialog.ShowDialog();
    }
}
