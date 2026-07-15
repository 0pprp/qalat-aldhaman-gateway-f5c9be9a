using System.Diagnostics;
using System.Net.Http.Json;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Win32;
using QalatAldhaman.Store.Admin.Models.Contracts;
using QalatAldhaman.Store.Admin.Models.Uploads;
using QalatAldhaman.Store.Admin.Services;

namespace QalatAldhaman.Store.Admin.ViewModels;

/// <summary>صف واحد بشاشة "عقود طرق الدفع" — يدير رفع/ربط ملفه الخاص باستقلالية عن بقية الصفوف.</summary>
public partial class ContractRowViewModel : ObservableObject
{
    private static readonly Dictionary<string, string> DisplayNames = new()
    {
        ["Cash"] = "نقد",
        ["MonthlyInstallment"] = "قسط شهري",
        ["MonthlyRafidain"] = "قسط شهري - رافدين",
        ["DailyInstallment"] = "قسط يومي",
    };

    private readonly ApiClient _apiClient;

    public string PurchaseMethod { get; }

    public string DisplayName => DisplayNames.GetValueOrDefault(PurchaseMethod, PurchaseMethod);

    [ObservableProperty]
    private string? _contractPdfUrl;

    [ObservableProperty]
    private bool _isUploading;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    public bool HasFile => !string.IsNullOrWhiteSpace(ContractPdfUrl);
    public string StatusText => HasFile ? "يوجد ملف" : "لا يوجد ملف";

    public ContractRowViewModel(ApiClient apiClient, PurchaseMethodContractDto dto)
    {
        _apiClient = apiClient;
        PurchaseMethod = dto.PurchaseMethod;
        ContractPdfUrl = dto.ContractPdfUrl;
    }

    partial void OnContractPdfUrlChanged(string? value)
    {
        OnPropertyChanged(nameof(HasFile));
        OnPropertyChanged(nameof(StatusText));
    }

    [RelayCommand]
    private async Task UploadAsync()
    {
        var dialog = new OpenFileDialog
        {
            Filter = "ملفات PDF (*.pdf)|*.pdf",
            Title = $"اختر ملف عقد ({DisplayName})",
        };

        if (dialog.ShowDialog() != true)
        {
            return;
        }

        IsUploading = true;
        ErrorMessage = string.Empty;

        try
        {
            var uploadResponse = await _apiClient.PostFileAsync("/api/uploads?folder=contracts", dialog.FileName);

            if (!uploadResponse.IsSuccessStatusCode)
            {
                if (uploadResponse.StatusCode != System.Net.HttpStatusCode.Unauthorized)
                {
                    ErrorMessage = await ApiMessageReader.ReadAsync(uploadResponse) ?? "تعذر رفع الملف";
                }
                return;
            }

            var uploadResult = await uploadResponse.Content.ReadFromJsonAsync<UploadResponse>(JsonDefaults.Options);
            if (uploadResult?.Url is null)
            {
                return;
            }

            var linkResponse = await _apiClient.PutAsJsonAsync(
                $"/api/admin/contracts/{PurchaseMethod}",
                new UpdateContractRequest { ContractPdfUrl = uploadResult.Url });

            if (linkResponse.IsSuccessStatusCode)
            {
                ContractPdfUrl = uploadResult.Url;
            }
            else if (linkResponse.StatusCode != System.Net.HttpStatusCode.Unauthorized)
            {
                ErrorMessage = await ApiMessageReader.ReadAsync(linkResponse) ?? "تعذر ربط الملف";
            }
        }
        catch (Exception)
        {
            ErrorMessage = "تعذر الاتصال بالخادم أثناء رفع الملف";
        }
        finally
        {
            IsUploading = false;
        }
    }

    [RelayCommand]
    private void Open()
    {
        var url = _apiClient.ResolveMediaUrl(ContractPdfUrl);
        if (string.IsNullOrWhiteSpace(url))
        {
            return;
        }

        Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
    }
}
