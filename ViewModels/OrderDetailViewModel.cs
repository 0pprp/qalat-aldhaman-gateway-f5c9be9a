using System.Diagnostics;
using System.Net.Http.Json;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using QalatAldhaman.Store.Admin.Models.Orders;
using QalatAldhaman.Store.Admin.Services;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class OrderDetailViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;
    private readonly int _orderId;

    public List<FilterOption> StatusOptions { get; } =
        [.. OrderDisplay.StatusOptions.Select(s => new FilterOption(s.Value, s.Label))];

    [ObservableProperty]
    private bool _isLoading = true;

    [ObservableProperty]
    private bool _isError;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    [ObservableProperty]
    private OrderDetailDto? _order;

    [ObservableProperty]
    private FilterOption? _selectedStatus;

    [ObservableProperty]
    private string _notes = string.Empty;

    [ObservableProperty]
    private bool _isSaving;

    public bool IsFormEnabled => !IsSaving;

    [ObservableProperty]
    private string _saveErrorMessage = string.Empty;

    public bool IsContentVisible => !IsLoading && !IsError;
    public bool WasStatusUpdated { get; private set; }

    public string OrderNumberTitle => Order is null ? string.Empty : $"تفاصيل الطلب {Order.OrderNumber}";
    public string PurchaseMethodText => Order is null ? string.Empty : OrderDisplay.PurchaseMethodName(Order.PurchaseMethod);
    public bool HasShopFields => !string.IsNullOrWhiteSpace(Order?.ShopName) || !string.IsNullOrWhiteSpace(Order?.ShopAddress);
    public bool HasHomeAddress => !string.IsNullOrWhiteSpace(Order?.HomeAddress);
    public bool HasNearestLandmark => !string.IsNullOrWhiteSpace(Order?.NearestLandmark);
    public bool HasCustomDescription => !string.IsNullOrWhiteSpace(Order?.CustomProductDescription);
    public bool HasMedia => !string.IsNullOrWhiteSpace(Order?.MediaUrl);
    public bool HasGps => Order?.GpsLat is not null && Order?.GpsLng is not null;
    public bool HasContract => !string.IsNullOrWhiteSpace(Order?.ContractPdfUrl);
    public bool HasInstallmentPayment => Order?.InstallmentPaymentAmountSnapshot is not null;

    public string InstallmentPaymentLabel => Order?.PurchaseMethod switch
    {
        "MonthlyInstallment" or "MonthlyRafidain" => "الدفعة الشهرية",
        "DailyInstallment" => "الدفعة اليومية",
        _ => "الدفعة الدورية",
    };

    public OrderDetailViewModel(ApiClient apiClient, int orderId)
    {
        _apiClient = apiClient;
        _orderId = orderId;
        _ = LoadAsync();
    }

    private async Task LoadAsync()
    {
        IsLoading = true;
        IsError = false;

        try
        {
            var response = await _apiClient.GetAsync($"/api/admin/orders/{_orderId}");

            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                return;
            }

            if (response.IsSuccessStatusCode)
            {
                Order = await response.Content.ReadFromJsonAsync<OrderDetailDto>(JsonDefaults.Options);
                if (Order is not null)
                {
                    SelectedStatus = StatusOptions.FirstOrDefault(s => s.Value == Order.Status);
                    Notes = Order.Notes ?? string.Empty;
                }

                RaiseAllComputed();
            }
            else
            {
                IsError = true;
                ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر تحميل تفاصيل الطلب";
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

    private void RaiseAllComputed()
    {
        OnPropertyChanged(nameof(OrderNumberTitle));
        OnPropertyChanged(nameof(PurchaseMethodText));
        OnPropertyChanged(nameof(HasShopFields));
        OnPropertyChanged(nameof(HasHomeAddress));
        OnPropertyChanged(nameof(HasNearestLandmark));
        OnPropertyChanged(nameof(HasCustomDescription));
        OnPropertyChanged(nameof(HasMedia));
        OnPropertyChanged(nameof(HasGps));
        OnPropertyChanged(nameof(HasContract));
        OnPropertyChanged(nameof(HasInstallmentPayment));
        OnPropertyChanged(nameof(InstallmentPaymentLabel));
    }

    partial void OnIsLoadingChanged(bool value) => OnPropertyChanged(nameof(IsContentVisible));
    partial void OnIsErrorChanged(bool value) => OnPropertyChanged(nameof(IsContentVisible));
    partial void OnIsSavingChanged(bool value) => OnPropertyChanged(nameof(IsFormEnabled));

    [RelayCommand]
    private async Task SaveStatusAsync()
    {
        if (Order is null || SelectedStatus?.Value is null)
        {
            return;
        }

        IsSaving = true;
        SaveErrorMessage = string.Empty;

        try
        {
            var response = await _apiClient.PutAsJsonAsync(
                $"/api/admin/orders/{_orderId}/status",
                new UpdateOrderStatusRequest { Status = SelectedStatus.Value, Notes = string.IsNullOrWhiteSpace(Notes) ? null : Notes.Trim() });

            if (response.IsSuccessStatusCode)
            {
                Order = await response.Content.ReadFromJsonAsync<OrderDetailDto>(JsonDefaults.Options);
                RaiseAllComputed();
                WasStatusUpdated = true;
            }
            else if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
            {
                SaveErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر حفظ الحالة";
            }
        }
        catch (Exception)
        {
            SaveErrorMessage = "تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى";
        }
        finally
        {
            IsSaving = false;
        }
    }

    [RelayCommand]
    private void OpenMedia()
    {
        var url = _apiClient.ResolveMediaUrl(Order?.MediaUrl);
        if (string.IsNullOrWhiteSpace(url))
        {
            return;
        }

        Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
    }

    [RelayCommand]
    private void OpenMaps()
    {
        if (Order?.GpsLat is null || Order?.GpsLng is null)
        {
            return;
        }

        var url = $"https://www.google.com/maps?q={Order.GpsLat},{Order.GpsLng}";
        Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
    }

    [RelayCommand]
    private void OpenContract()
    {
        var url = _apiClient.ResolveMediaUrl(Order?.ContractPdfUrl);
        if (string.IsNullOrWhiteSpace(url))
        {
            return;
        }

        Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
    }
}
