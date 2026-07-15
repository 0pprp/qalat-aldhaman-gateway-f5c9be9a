using System.Net.Http.Json;
using System.Windows.Media.Imaging;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Win32;
using QalatAldhaman.Store.Admin.Models.Categories;
using QalatAldhaman.Store.Admin.Models.Uploads;
using QalatAldhaman.Store.Admin.Services;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class CategoryEditViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;
    private readonly int? _categoryId;

    public string DialogTitle => _categoryId.HasValue ? "تعديل فئة" : "إضافة فئة جديدة";

    /// <summary>يُطلق عند نجاح الحفظ فعلياً بالباك اند — النافذة تُغلق عندها بـ CategoryEditDialog.xaml.cs.</summary>
    public event Action? SavedSuccessfully;

    [ObservableProperty]
    private string _name = string.Empty;

    [ObservableProperty]
    private string _description = string.Empty;

    [ObservableProperty]
    private string? _imageUrl;

    [ObservableProperty]
    private bool _isUploadingImage;

    [ObservableProperty]
    private bool _allowsCash;

    [ObservableProperty]
    private bool _allowsMonthlyInstallment;

    [ObservableProperty]
    private bool _allowsDailyInstallment;

    [ObservableProperty]
    private bool _requiresShopOwner;

    [ObservableProperty]
    private string _minInvoiceCash = string.Empty;

    [ObservableProperty]
    private string _minInvoiceInstallment = string.Empty;

    [ObservableProperty]
    private bool _hasCustomProductField;

    [ObservableProperty]
    private int _displayOrder;

    [ObservableProperty]
    private bool _isActive = true;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    [ObservableProperty]
    private bool _isSaving;

    public bool IsCashInvoiceVisible => AllowsCash;
    public bool IsInstallmentInvoiceVisible => AllowsMonthlyInstallment || AllowsDailyInstallment;
    public bool IsFormEnabled => !IsSaving;

    public BitmapImage? ImagePreview
    {
        get
        {
            var url = _apiClient.ResolveMediaUrl(ImageUrl);
            if (string.IsNullOrWhiteSpace(url))
            {
                return null;
            }

            try
            {
                return new BitmapImage(new Uri(url));
            }
            catch
            {
                return null;
            }
        }
    }

    public CategoryEditViewModel(ApiClient apiClient, CategoryDto? existing)
    {
        _apiClient = apiClient;

        if (existing is not null)
        {
            _categoryId = existing.Id;
            Name = existing.Name;
            Description = existing.Description ?? string.Empty;
            ImageUrl = existing.ImageUrl;
            AllowsCash = existing.AllowsCash;
            AllowsMonthlyInstallment = existing.AllowsMonthlyInstallment;
            AllowsDailyInstallment = existing.AllowsDailyInstallment;
            RequiresShopOwner = existing.RequiresShopOwner;
            MinInvoiceCash = existing.MinInvoiceCash?.ToString() ?? string.Empty;
            MinInvoiceInstallment = existing.MinInvoiceInstallment?.ToString() ?? string.Empty;
            HasCustomProductField = existing.HasCustomProductField;
            DisplayOrder = existing.DisplayOrder;
            IsActive = existing.IsActive;
        }
    }

    partial void OnAllowsCashChanged(bool value) => OnPropertyChanged(nameof(IsCashInvoiceVisible));

    partial void OnAllowsMonthlyInstallmentChanged(bool value) => OnPropertyChanged(nameof(IsInstallmentInvoiceVisible));

    partial void OnAllowsDailyInstallmentChanged(bool value) => OnPropertyChanged(nameof(IsInstallmentInvoiceVisible));

    partial void OnIsSavingChanged(bool value) => OnPropertyChanged(nameof(IsFormEnabled));

    partial void OnImageUrlChanged(string? value) => OnPropertyChanged(nameof(ImagePreview));

    [RelayCommand]
    private async Task SelectImageAsync()
    {
        var dialog = new OpenFileDialog
        {
            Filter = "صور (*.jpg;*.jpeg;*.png;*.webp)|*.jpg;*.jpeg;*.png;*.webp",
            Title = "اختر صورة الفئة",
        };

        if (dialog.ShowDialog() != true)
        {
            return;
        }

        IsUploadingImage = true;
        ErrorMessage = string.Empty;

        try
        {
            var response = await _apiClient.PostFileAsync("/api/uploads?folder=categories", dialog.FileName);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<UploadResponse>(JsonDefaults.Options);
                ImageUrl = result?.Url;
            }
            else if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
            {
                ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر رفع الصورة";
            }
        }
        catch (Exception)
        {
            ErrorMessage = "تعذر الاتصال بالخادم أثناء رفع الصورة";
        }
        finally
        {
            IsUploadingImage = false;
        }
    }

    [RelayCommand]
    private async Task SaveAsync()
    {
        if (string.IsNullOrWhiteSpace(Name))
        {
            ErrorMessage = "اسم الفئة مطلوب";
            return;
        }

        ErrorMessage = string.Empty;
        IsSaving = true;

        try
        {
            var payload = new CategoryUpsertRequest
            {
                Name = Name.Trim(),
                Description = string.IsNullOrWhiteSpace(Description) ? null : Description.Trim(),
                ImageUrl = ImageUrl,
                AllowsCash = AllowsCash,
                AllowsMonthlyInstallment = AllowsMonthlyInstallment,
                AllowsDailyInstallment = AllowsDailyInstallment,
                RequiresShopOwner = RequiresShopOwner,
                MinInvoiceCash = ParseDecimalOrNull(MinInvoiceCash),
                MinInvoiceInstallment = ParseDecimalOrNull(MinInvoiceInstallment),
                HasCustomProductField = HasCustomProductField,
                DisplayOrder = DisplayOrder,
                IsActive = IsActive,
            };

            var response = _categoryId.HasValue
                ? await _apiClient.PutAsJsonAsync($"/api/admin/categories/{_categoryId.Value}", payload)
                : await _apiClient.PostAsJsonAsync("/api/admin/categories", payload);

            if (response.IsSuccessStatusCode)
            {
                SavedSuccessfully?.Invoke();
            }
            else if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
            {
                ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر حفظ الفئة";
            }
        }
        catch (Exception)
        {
            ErrorMessage = "تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى";
        }
        finally
        {
            IsSaving = false;
        }
    }

    private static decimal? ParseDecimalOrNull(string value) =>
        decimal.TryParse(value, out var result) ? result : null;
}
