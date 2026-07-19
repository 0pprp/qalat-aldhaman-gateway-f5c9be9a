using System.Collections.ObjectModel;
using System.Net.Http.Json;
using System.Windows;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Win32;
using QalatAldhaman.Store.Admin.Models.Categories;
using QalatAldhaman.Store.Admin.Models.Products;
using QalatAldhaman.Store.Admin.Models.Uploads;
using QalatAldhaman.Store.Admin.Services;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class ProductEditViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;
    private int? _productId;
    private bool _hasSavedAtLeastOnce;

    public List<CategoryDto> AvailableCategories { get; }

    public ObservableCollection<ProductImageRowViewModel> Images { get; } = [];

    [ObservableProperty]
    private CategoryDto? _selectedCategory;

    [ObservableProperty]
    private string _name = string.Empty;

    [ObservableProperty]
    private string _description = string.Empty;

    [ObservableProperty]
    private string _cashPrice = string.Empty;

    [ObservableProperty]
    private string _monthlyTotalPrice = string.Empty;

    [ObservableProperty]
    private string _monthlyPaymentAmount = string.Empty;

    [ObservableProperty]
    private string _monthlyDownPayment = string.Empty;

    [ObservableProperty]
    private string _rafidainTotalPrice = string.Empty;

    [ObservableProperty]
    private string _rafidainPaymentAmount = string.Empty;

    [ObservableProperty]
    private string _rafidainDownPayment = string.Empty;

    [ObservableProperty]
    private string _dailyTotalPrice = string.Empty;

    [ObservableProperty]
    private string _dailyPaymentAmount = string.Empty;

    [ObservableProperty]
    private string _sku = string.Empty;

    [ObservableProperty]
    private bool _isActive = true;

    [ObservableProperty]
    private bool _isUploadingImage;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    [ObservableProperty]
    private bool _isSaving;

    public string DialogTitle => _productId.HasValue ? "تعديل منتج" : "إضافة منتج جديد";

    public bool IsCashPriceEnabled => SelectedCategory?.AllowsCash ?? false;
    public bool IsMonthlyPriceEnabled => SelectedCategory?.AllowsMonthlyInstallment ?? false;
    public bool IsRafidainPriceEnabled => SelectedCategory?.AllowsMonthlyInstallment ?? false;
    public bool IsDailyPriceEnabled => SelectedCategory?.AllowsDailyInstallment ?? false;

    public bool IsImagesSectionEnabled => _productId.HasValue;
    public string ImagesSectionNote => _productId.HasValue ? string.Empty : "احفظ المنتج أولاً لإضافة الصور";

    public bool IsFormEnabled => !IsSaving;

    /// <summary>تُطلق بعد أول حفظ ناجح فقط (لتفعيل التبويبات التابعة)، لا تُغلق النافذة تلقائياً.</summary>
    public event Action? ProductCreated;

    public ProductEditViewModel(ApiClient apiClient, ProductDto? existing, List<CategoryDto> availableCategories)
    {
        _apiClient = apiClient;
        AvailableCategories = availableCategories;

        if (existing is not null)
        {
            _productId = existing.Id;
            _hasSavedAtLeastOnce = true;
            SelectedCategory = availableCategories.FirstOrDefault(c => c.Id == existing.CategoryId);
            Name = existing.Name;
            Description = existing.Description ?? string.Empty;
            CashPrice = existing.CashPrice?.ToString() ?? string.Empty;
            MonthlyTotalPrice = existing.MonthlyTotalPrice?.ToString() ?? string.Empty;
            MonthlyPaymentAmount = existing.MonthlyPaymentAmount?.ToString() ?? string.Empty;
            MonthlyDownPayment = existing.MonthlyDownPayment?.ToString() ?? string.Empty;
            RafidainTotalPrice = existing.RafidainTotalPrice?.ToString() ?? string.Empty;
            RafidainPaymentAmount = existing.RafidainPaymentAmount?.ToString() ?? string.Empty;
            RafidainDownPayment = existing.RafidainDownPayment?.ToString() ?? string.Empty;
            DailyTotalPrice = existing.DailyTotalPrice?.ToString() ?? string.Empty;
            DailyPaymentAmount = existing.DailyPaymentAmount?.ToString() ?? string.Empty;
            Sku = existing.SKU ?? string.Empty;
            IsActive = existing.IsActive;

            foreach (var image in existing.Images)
            {
                Images.Add(new ProductImageRowViewModel(image, apiClient.ResolveMediaUrl(image.ImageUrl)));
            }
        }
    }

    partial void OnSelectedCategoryChanged(CategoryDto? value)
    {
        OnPropertyChanged(nameof(IsCashPriceEnabled));
        OnPropertyChanged(nameof(IsMonthlyPriceEnabled));
        OnPropertyChanged(nameof(IsRafidainPriceEnabled));
        OnPropertyChanged(nameof(IsDailyPriceEnabled));

        if (!IsCashPriceEnabled) CashPrice = string.Empty;
        if (!IsMonthlyPriceEnabled)
        {
            MonthlyTotalPrice = string.Empty;
            MonthlyPaymentAmount = string.Empty;
            MonthlyDownPayment = string.Empty;
        }

        if (!IsRafidainPriceEnabled)
        {
            RafidainTotalPrice = string.Empty;
            RafidainPaymentAmount = string.Empty;
            RafidainDownPayment = string.Empty;
        }

        if (!IsDailyPriceEnabled)
        {
            DailyTotalPrice = string.Empty;
            DailyPaymentAmount = string.Empty;
        }
    }

    partial void OnIsSavingChanged(bool value) => OnPropertyChanged(nameof(IsFormEnabled));

    [RelayCommand]
    private async Task SaveAsync()
    {
        if (string.IsNullOrWhiteSpace(Name))
        {
            ErrorMessage = "اسم الموديل مطلوب";
            return;
        }

        if (SelectedCategory is null)
        {
            ErrorMessage = "يجب اختيار فئة";
            return;
        }

        var cash = ParseDecimalOrNull(CashPrice);
        var monthlyTotal = ParseDecimalOrNull(MonthlyTotalPrice);
        var monthlyPayment = ParseDecimalOrNull(MonthlyPaymentAmount);
        var monthlyDownPayment = ParseDecimalOrNull(MonthlyDownPayment);
        var rafidainTotal = ParseDecimalOrNull(RafidainTotalPrice);
        var rafidainPayment = ParseDecimalOrNull(RafidainPaymentAmount);
        var rafidainDownPayment = ParseDecimalOrNull(RafidainDownPayment);
        var dailyTotal = ParseDecimalOrNull(DailyTotalPrice);
        var dailyPayment = ParseDecimalOrNull(DailyPaymentAmount);

        if (cash is null && monthlyTotal is null && monthlyPayment is null && rafidainTotal is null && rafidainPayment is null && dailyTotal is null && dailyPayment is null)
        {
            ErrorMessage = "يجب إدخال سعر واحد على الأقل ضمن الأسعار المسموحة لهذه الفئة";
            return;
        }

        if (monthlyTotal.HasValue != monthlyPayment.HasValue || rafidainTotal.HasValue != rafidainPayment.HasValue || dailyTotal.HasValue != dailyPayment.HasValue)
        {
            MessageBox.Show(
                "يجب تعبئة كلا الحقلين معاً (المبلغ الكلي والدفعة) وإلا سيُعتبر هذا الخيار غير متوفر",
                "تنبيه",
                MessageBoxButton.OK,
                MessageBoxImage.Warning);
        }

        if (monthlyDownPayment.HasValue && !(monthlyTotal.HasValue && monthlyPayment.HasValue))
        {
            MessageBox.Show(
                "لا يمكن تحديد مقدمة القسط الشهري قبل تعبئة المبلغ الكلي والدفعة الشهرية للقسط الشهري",
                "تنبيه",
                MessageBoxButton.OK,
                MessageBoxImage.Warning);
            return;
        }

        if (rafidainDownPayment.HasValue && !(rafidainTotal.HasValue && rafidainPayment.HasValue))
        {
            MessageBox.Show(
                "لا يمكن تحديد مقدمة قسط الرافدين قبل تعبئة المبلغ الكلي والدفعة الشهرية لقسط الرافدين",
                "تنبيه",
                MessageBoxButton.OK,
                MessageBoxImage.Warning);
            return;
        }

        ErrorMessage = string.Empty;
        IsSaving = true;

        try
        {
            var payload = new ProductUpsertRequest
            {
                CategoryId = SelectedCategory.Id,
                Name = Name.Trim(),
                Description = string.IsNullOrWhiteSpace(Description) ? null : Description.Trim(),
                CashPrice = cash,
                MonthlyTotalPrice = monthlyTotal,
                MonthlyPaymentAmount = monthlyPayment,
                MonthlyDownPayment = monthlyDownPayment,
                RafidainTotalPrice = rafidainTotal,
                RafidainPaymentAmount = rafidainPayment,
                RafidainDownPayment = rafidainDownPayment,
                DailyTotalPrice = dailyTotal,
                DailyPaymentAmount = dailyPayment,
                SKU = string.IsNullOrWhiteSpace(Sku) ? null : Sku.Trim(),
                IsActive = IsActive,
            };

            var response = _productId.HasValue
                ? await _apiClient.PutAsJsonAsync($"/api/admin/products/{_productId.Value}", payload)
                : await _apiClient.PostAsJsonAsync("/api/admin/products", payload);

            if (response.IsSuccessStatusCode)
            {
                _hasSavedAtLeastOnce = true;

                if (!_productId.HasValue)
                {
                    var created = await response.Content.ReadFromJsonAsync<ProductDto>(JsonDefaults.Options);
                    if (created is not null)
                    {
                        _productId = created.Id;
                        OnPropertyChanged(nameof(DialogTitle));
                        OnPropertyChanged(nameof(IsImagesSectionEnabled));
                        OnPropertyChanged(nameof(ImagesSectionNote));
                        ProductCreated?.Invoke();
                    }
                }
            }
            else if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
            {
                ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر حفظ المنتج";
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

    [RelayCommand]
    private async Task AddImageAsync()
    {
        if (!_productId.HasValue)
        {
            return;
        }

        var dialog = new OpenFileDialog
        {
            Filter = "صور (*.jpg;*.jpeg;*.png;*.webp)|*.jpg;*.jpeg;*.png;*.webp",
            Title = "اختر صورة المنتج",
        };

        if (dialog.ShowDialog() != true)
        {
            return;
        }

        IsUploadingImage = true;
        ErrorMessage = string.Empty;

        try
        {
            var uploadResponse = await _apiClient.PostFileAsync("/api/uploads?folder=products", dialog.FileName);

            if (!uploadResponse.IsSuccessStatusCode)
            {
                if (uploadResponse.StatusCode != System.Net.HttpStatusCode.Unauthorized)
                {
                    ErrorMessage = await ApiMessageReader.ReadAsync(uploadResponse) ?? "تعذر رفع الصورة";
                }
                return;
            }

            var uploadResult = await uploadResponse.Content.ReadFromJsonAsync<UploadResponse>(JsonDefaults.Options);
            if (uploadResult?.Url is null)
            {
                return;
            }

            var linkRequest = new AddProductImageRequest
            {
                ImageUrl = uploadResult.Url,
                DisplayOrder = Images.Count,
            };

            var linkResponse = await _apiClient.PostAsJsonAsync($"/api/admin/products/{_productId.Value}/images", linkRequest);

            if (linkResponse.IsSuccessStatusCode)
            {
                var image = await linkResponse.Content.ReadFromJsonAsync<ProductImageDto>(JsonDefaults.Options);
                if (image is not null)
                {
                    Images.Add(new ProductImageRowViewModel(image, _apiClient.ResolveMediaUrl(image.ImageUrl)));
                }
            }
            else if (linkResponse.StatusCode != System.Net.HttpStatusCode.Unauthorized)
            {
                ErrorMessage = await ApiMessageReader.ReadAsync(linkResponse) ?? "تعذر ربط الصورة بالمنتج";
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
    private async Task RemoveImageAsync(ProductImageRowViewModel image)
    {
        if (!_productId.HasValue)
        {
            return;
        }

        var confirm = MessageBox.Show("هل أنت متأكد من حذف هذه الصورة؟", "تأكيد الحذف", MessageBoxButton.YesNo, MessageBoxImage.Warning);
        if (confirm != MessageBoxResult.Yes)
        {
            return;
        }

        try
        {
            var response = await _apiClient.DeleteAsync($"/api/admin/products/{_productId.Value}/images/{image.Image.Id}");
            if (response.IsSuccessStatusCode)
            {
                Images.Remove(image);
            }
            else if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
            {
                ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر حذف الصورة";
            }
        }
        catch (Exception)
        {
            ErrorMessage = "تعذر الاتصال بالخادم أثناء حذف الصورة";
        }
    }

    public bool WasSaved => _hasSavedAtLeastOnce;

    private static decimal? ParseDecimalOrNull(string value) =>
        decimal.TryParse(value, out var result) ? result : null;
}
