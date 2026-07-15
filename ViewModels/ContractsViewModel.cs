using System.Collections.ObjectModel;
using System.Net;
using System.Net.Http.Json;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using QalatAldhaman.Store.Admin.Models.Contracts;
using QalatAldhaman.Store.Admin.Services;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class ContractsViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;

    public ObservableCollection<ContractRowViewModel> Contracts { get; } = [];

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private bool _isError;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    public bool IsContentVisible => !IsLoading && !IsError;

    public ContractsViewModel(ApiClient apiClient)
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
            var response = await _apiClient.GetAsync("/api/admin/contracts");

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                return;
            }

            if (response.IsSuccessStatusCode)
            {
                var contracts = await response.Content.ReadFromJsonAsync<List<PurchaseMethodContractDto>>(JsonDefaults.Options);
                Contracts.Clear();
                foreach (var contract in contracts ?? [])
                {
                    Contracts.Add(new ContractRowViewModel(_apiClient, contract));
                }
            }
            else
            {
                IsError = true;
                ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر تحميل عقود طرق الدفع";
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
}
