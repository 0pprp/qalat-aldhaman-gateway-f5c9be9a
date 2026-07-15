using System.Collections.ObjectModel;
using System.Net;
using System.Net.Http.Json;
using System.Windows;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using QalatAldhaman.Store.Admin.Models.Reviews;
using QalatAldhaman.Store.Admin.Services;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class ReviewsViewModel : ObservableObject
{
    private readonly ApiClient _apiClient;

    public ObservableCollection<ReviewRowViewModel> Reviews { get; } = [];

    [ObservableProperty]
    private bool _pendingOnly = true;

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private bool _isError;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    public bool IsContentVisible => !IsLoading && !IsError;
    public bool IsEmpty => IsContentVisible && Reviews.Count == 0;
    public bool HasReviews => IsContentVisible && Reviews.Count > 0;

    public ReviewsViewModel(ApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    partial void OnIsLoadingChanged(bool value)
    {
        OnPropertyChanged(nameof(IsContentVisible));
        OnPropertyChanged(nameof(IsEmpty));
        OnPropertyChanged(nameof(HasReviews));
    }

    partial void OnIsErrorChanged(bool value)
    {
        OnPropertyChanged(nameof(IsContentVisible));
        OnPropertyChanged(nameof(IsEmpty));
        OnPropertyChanged(nameof(HasReviews));
    }

    partial void OnPendingOnlyChanged(bool value) => _ = LoadAsync();

    [RelayCommand]
    public async Task LoadAsync()
    {
        IsLoading = true;
        IsError = false;
        ErrorMessage = string.Empty;

        try
        {
            var uri = PendingOnly ? "/api/admin/reviews?pending=true" : "/api/admin/reviews";
            var response = await _apiClient.GetAsync(uri);

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                return;
            }

            if (response.IsSuccessStatusCode)
            {
                var reviews = await response.Content.ReadFromJsonAsync<List<ReviewDto>>(JsonDefaults.Options);
                Reviews.Clear();
                foreach (var review in reviews ?? [])
                {
                    Reviews.Add(new ReviewRowViewModel(review));
                }
            }
            else
            {
                IsError = true;
                ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "تعذر تحميل الآراء";
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
    private async Task ApproveAsync(ReviewRowViewModel row)
    {
        try
        {
            var response = await _apiClient.PutAsJsonAsync($"/api/admin/reviews/{row.Id}/approve", new { });

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
                var error = await ApiMessageReader.ReadAsync(response) ?? "تعذر اعتماد الرأي";
                MessageBox.Show(error, "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        catch (Exception)
        {
            MessageBox.Show("تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى", "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    [RelayCommand]
    private async Task DeleteAsync(ReviewRowViewModel row)
    {
        var confirm = MessageBox.Show(
            "هل أنت متأكد من حذف هذا الرأي؟",
            "تأكيد الحذف",
            MessageBoxButton.YesNo,
            MessageBoxImage.Warning);

        if (confirm != MessageBoxResult.Yes)
        {
            return;
        }

        try
        {
            var response = await _apiClient.DeleteAsync($"/api/admin/reviews/{row.Id}");

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
                var error = await ApiMessageReader.ReadAsync(response) ?? "تعذر حذف الرأي";
                MessageBox.Show(error, "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        catch (Exception)
        {
            MessageBox.Show("تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى", "خطأ", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }
}
