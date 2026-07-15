using System.Collections.ObjectModel;
using System.Net;
using System.Net.Http.Json;
using System.Windows;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using QalatAldhaman.Store.Admin.Models.Categories;
using QalatAldhaman.Store.Admin.Services;
using QalatAldhaman.Store.Admin.Views;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class CategoriesViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;

    public ObservableCollection<CategoryRowViewModel> Categories { get; } = [];

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private bool _isError;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    public bool IsContentVisible => !IsLoading && !IsError;
    public bool IsEmpty => IsContentVisible && Categories.Count == 0;
    public bool HasCategories => IsContentVisible && Categories.Count > 0;

    public CategoriesViewModel(ApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    partial void OnIsLoadingChanged(bool value)
    {
        OnPropertyChanged(nameof(IsContentVisible));
        OnPropertyChanged(nameof(IsEmpty));
        OnPropertyChanged(nameof(HasCategories));
    }

    partial void OnIsErrorChanged(bool value)
    {
        OnPropertyChanged(nameof(IsContentVisible));
        OnPropertyChanged(nameof(IsEmpty));
        OnPropertyChanged(nameof(HasCategories));
    }

    [RelayCommand]
    public async Task LoadAsync()
    {
        IsLoading = true;
        IsError = false;
        ErrorMessage = string.Empty;

        try
        {
            var response = await _apiClient.GetAsync("/api/admin/categories");

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                // الجلسة تُنهى تلقائياً من ApiClient نفسه (يعيد المستخدم لشاشة الدخول) — لا داعي لعرض خطأ هنا.
                return;
            }

            if (response.IsSuccessStatusCode)
            {
                var categories = await response.Content.ReadFromJsonAsync<List<CategoryDto>>(JsonDefaults.Options);
                Categories.Clear();
                foreach (var category in categories ?? [])
                {
                    Categories.Add(new CategoryRowViewModel(category));
                }
            }
            else
            {
                IsError = true;
                ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر تحميل الفئات";
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
    private void AddCategory()
    {
        OpenEditDialog(existing: null);
    }

    [RelayCommand]
    private void EditCategory(CategoryRowViewModel row)
    {
        OpenEditDialog(existing: row.Category);
    }

    [RelayCommand]
    private async Task DeleteCategoryAsync(CategoryRowViewModel row)
    {
        var confirm = MessageBox.Show(
            $"هل أنت متأكد من حذف/تعطيل الفئة \"{row.Category.Name}\"؟",
            "تأكيد الحذف",
            MessageBoxButton.YesNo,
            MessageBoxImage.Warning);

        if (confirm != MessageBoxResult.Yes)
        {
            return;
        }

        try
        {
            var response = await _apiClient.DeleteAsync($"/api/admin/categories/{row.Category.Id}");

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                return;
            }

            if (response.StatusCode == HttpStatusCode.NoContent)
            {
                MessageBox.Show("تم حذف الفئة نهائياً.", "تم الحذف", MessageBoxButton.OK, MessageBoxImage.Information);
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
                var error = await ApiMessageReader.ReadAsync(response) ?? "تعذر حذف الفئة";
                MessageBox.Show(error, "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        catch (Exception)
        {
            MessageBox.Show("تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى", "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void OpenEditDialog(CategoryDto? existing)
    {
        var viewModel = new CategoryEditViewModel(_apiClient, existing);
        var dialog = new CategoryEditDialog(viewModel)
        {
            Owner = Application.Current.MainWindow,
        };

        if (dialog.ShowDialog() == true)
        {
            _ = LoadAsync();
        }
    }
}
