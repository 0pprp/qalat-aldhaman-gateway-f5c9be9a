using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Net;
using System.Net.Http.Json;
using System.Windows;
using ClosedXML.Excel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Win32;
using QalatAldhaman.Store.Admin.Models.Categories;
using QalatAldhaman.Store.Admin.Models.Governorates;
using QalatAldhaman.Store.Admin.Models.Orders;
using QalatAldhaman.Store.Admin.Services;
using QalatAldhaman.Store.Admin.Views;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class OrdersViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;

    public ObservableCollection<OrderRowViewModel> Orders { get; } = [];

    public ObservableCollection<CategoryDto> Categories { get; } = [];

    public ObservableCollection<GovernorateDto> Governorates { get; } = [];

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
    private GovernorateDto? _selectedGovernorateFilter;

    private bool _suppressFilterReload;

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

    partial void OnSelectedStatusFilterChanged(FilterOption? value) => TriggerReload();
    partial void OnSelectedPurchaseMethodFilterChanged(FilterOption? value) => TriggerReload();
    partial void OnSelectedCategoryFilterChanged(CategoryDto? value) => TriggerReload();
    partial void OnSelectedGovernorateFilterChanged(GovernorateDto? value) => TriggerReload();

    private void TriggerReload()
    {
        if (!_suppressFilterReload)
        {
            _ = LoadAsync();
        }
    }

    public async Task InitializeAsync()
    {
        await LoadCategoriesAsync();
        await LoadGovernoratesAsync();
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

    private async Task LoadGovernoratesAsync()
    {
        try
        {
            var response = await _apiClient.GetAsync("/api/governorates");
            if (response.IsSuccessStatusCode)
            {
                var governorates = await response.Content.ReadFromJsonAsync<List<GovernorateDto>>(JsonDefaults.Options);
                Governorates.Clear();
                foreach (var governorate in governorates ?? [])
                {
                    Governorates.Add(governorate);
                }
            }
        }
        catch (Exception)
        {
            // فشل تحميل المحافظات هنا لا يمنع عرض الطلبات — فلتر المحافظة يبقى فارغاً فقط.
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
            if (SelectedGovernorateFilter is not null) query.Add($"governorateId={SelectedGovernorateFilter.Id}");

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
    private async Task ClearFilters()
    {
        _suppressFilterReload = true;
        SelectedStatusFilter = null;
        SelectedPurchaseMethodFilter = null;
        SelectedCategoryFilter = null;
        SelectedGovernorateFilter = null;
        _suppressFilterReload = false;

        await LoadAsync();
    }

    [RelayCommand]
    private void ExportToExcel()
    {
        if (Orders.Count == 0)
        {
            MessageBox.Show("لا توجد بيانات لتصديرها", "تصدير إلى Excel", MessageBoxButton.OK, MessageBoxImage.Information);
            return;
        }

        var dialog = new SaveFileDialog
        {
            Filter = "ملفات Excel (*.xlsx)|*.xlsx",
            FileName = $"طلبات-قلعة-الضمان-{DateTime.Now:yyyy-MM-dd}.xlsx",
        };

        if (dialog.ShowDialog() != true)
        {
            return;
        }

        try
        {
            using var workbook = new XLWorkbook();
            var sheet = workbook.Worksheets.Add("الطلبات");
            sheet.RightToLeft = true;

            string[] headers =
            [
                "رقم الطلب", "اسم الزبون", "رقم الهاتف", "المحافظة", "اسم المنتج",
                "طريقة الدفع", "المبلغ الكلي", "الدفعة الدورية", "الحالة", "التاريخ",
            ];

            for (var i = 0; i < headers.Length; i++)
            {
                var headerCell = sheet.Cell(1, i + 1);
                headerCell.Value = headers[i];
                headerCell.Style.Font.Bold = true;
            }

            var row = 2;
            foreach (var order in Orders)
            {
                sheet.Cell(row, 1).Value = order.OrderNumber;
                sheet.Cell(row, 2).Value = order.CustomerName;
                sheet.Cell(row, 3).Value = order.PhoneNumber;
                sheet.Cell(row, 4).Value = order.GovernorateName;
                sheet.Cell(row, 5).Value = order.ProductName;
                sheet.Cell(row, 6).Value = order.PurchaseMethodText;
                sheet.Cell(row, 7).Value = order.TotalPriceSnapshot;

                if (order.InstallmentPaymentAmountSnapshot is { } installmentAmount)
                {
                    sheet.Cell(row, 8).Value = installmentAmount;
                }

                sheet.Cell(row, 9).Value = order.StatusText;
                sheet.Cell(row, 10).Value = order.CreatedAtText;
                row++;
            }

            sheet.Columns().AdjustToContents();
            workbook.SaveAs(dialog.FileName);

            var openResult = MessageBox.Show(
                "تم التصدير بنجاح. هل تريد فتح الملف الآن؟",
                "تصدير إلى Excel",
                MessageBoxButton.YesNo,
                MessageBoxImage.Information);

            if (openResult == MessageBoxResult.Yes)
            {
                Process.Start(new ProcessStartInfo(dialog.FileName) { UseShellExecute = true });
            }
        }
        catch (Exception ex)
        {
            MessageBox.Show($"فشل التصدير: {ex.Message}", "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    [RelayCommand]
    private async Task DeleteOrderAsync(OrderRowViewModel row)
    {
        var confirm = MessageBox.Show(
            $"هل أنت متأكد من حذف الطلب {row.OrderNumber} نهائياً؟\nهذا الإجراء لا يمكن التراجع عنه.",
            "تأكيد حذف الطلب",
            MessageBoxButton.YesNo,
            MessageBoxImage.Warning);

        if (confirm != MessageBoxResult.Yes)
        {
            return;
        }

        try
        {
            var response = await _apiClient.DeleteAsync($"/api/admin/orders/{row.Id}");

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                return;
            }

            if (response.IsSuccessStatusCode)
            {
                await LoadAsync();
            }
            else
            {
                var error = await ApiMessageReader.ReadAsync(response) ?? "تعذر حذف الطلب";
                MessageBox.Show(error, "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        catch (Exception)
        {
            MessageBox.Show("تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى", "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
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

        if (viewModel.WasStatusUpdated || viewModel.WasDeleted)
        {
            _ = LoadAsync();
        }
    }
}
