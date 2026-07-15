using System.Collections.ObjectModel;
using System.Net;
using System.Net.Http.Json;
using System.Windows;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using QalatAldhaman.Store.Admin.Models.Categories;
using QalatAldhaman.Store.Admin.Models.Products;
using QalatAldhaman.Store.Admin.Services;
using QalatAldhaman.Store.Admin.Views;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class ProductsViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;

    public ObservableCollection<ProductRowViewModel> Products { get; } = [];

    public ObservableCollection<CategoryDto> Categories { get; } = [];

    [ObservableProperty]
    private CategoryDto? _selectedCategoryFilter;

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private bool _isError;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    public bool IsContentVisible => !IsLoading && !IsError;
    public bool IsEmpty => IsContentVisible && Products.Count == 0;
    public bool HasProducts => IsContentVisible && Products.Count > 0;

    public ProductsViewModel(ApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    partial void OnIsLoadingChanged(bool value)
    {
        OnPropertyChanged(nameof(IsContentVisible));
        OnPropertyChanged(nameof(IsEmpty));
        OnPropertyChanged(nameof(HasProducts));
    }

    partial void OnIsErrorChanged(bool value)
    {
        OnPropertyChanged(nameof(IsContentVisible));
        OnPropertyChanged(nameof(IsEmpty));
        OnPropertyChanged(nameof(HasProducts));
    }

    partial void OnSelectedCategoryFilterChanged(CategoryDto? value)
    {
        _ = LoadAsync();
    }

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
            // فشل تحميل الفئات هنا لا يمنع عرض المنتجات — فلتر الفئة يبقى فارغاً فقط.
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
            var query = SelectedCategoryFilter is not null
                ? $"/api/admin/products?categoryId={SelectedCategoryFilter.Id}"
                : "/api/admin/products";

            var response = await _apiClient.GetAsync(query);

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                return;
            }

            if (response.IsSuccessStatusCode)
            {
                var products = await response.Content.ReadFromJsonAsync<List<ProductDto>>(JsonDefaults.Options);
                Products.Clear();
                foreach (var product in products ?? [])
                {
                    Products.Add(new ProductRowViewModel(product));
                }
            }
            else
            {
                IsError = true;
                ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر تحميل المنتجات";
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
    private void AddProduct()
    {
        OpenEditDialog(existing: null);
    }

    [RelayCommand]
    private void EditProduct(ProductRowViewModel row)
    {
        OpenEditDialog(existing: row.Product);
    }

    [RelayCommand]
    private async Task DeleteProductAsync(ProductRowViewModel row)
    {
        var confirm = MessageBox.Show(
            $"هل أنت متأكد من حذف/تعطيل المنتج \"{row.Product.Name}\"؟",
            "تأكيد الحذف",
            MessageBoxButton.YesNo,
            MessageBoxImage.Warning);

        if (confirm != MessageBoxResult.Yes)
        {
            return;
        }

        try
        {
            var response = await _apiClient.DeleteAsync($"/api/admin/products/{row.Product.Id}");

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                return;
            }

            if (response.StatusCode == HttpStatusCode.NoContent)
            {
                MessageBox.Show("تم حذف المنتج نهائياً.", "تم الحذف", MessageBoxButton.OK, MessageBoxImage.Information);
                await LoadAsync();
            }
            else if (response.IsSuccessStatusCode)
            {
                var message = await ApiMessageReader.ReadAsync(response);
                MessageBox.Show(message ?? "تمت العملية بنجاح.", "نتيجة الحذف", MessageBoxButton.OK, MessageBoxImage.Information);
                await LoadAsync();
            }
            else
            {
                var error = await ApiMessageReader.ReadAsync(response) ?? "تعذر حذف المنتج";
                MessageBox.Show(error, "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        catch (Exception)
        {
            MessageBox.Show("تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى", "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void OpenEditDialog(ProductDto? existing)
    {
        var viewModel = new ProductEditViewModel(_apiClient, existing, [.. Categories]);
        var dialog = new ProductEditDialog(viewModel)
        {
            Owner = Application.Current.MainWindow,
        };

        if (dialog.ShowDialog() == true)
        {
            _ = LoadAsync();
        }
    }
}
