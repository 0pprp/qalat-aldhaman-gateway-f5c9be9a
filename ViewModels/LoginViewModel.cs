using System.Net.Http.Json;
using CommunityToolkit.Mvvm.ComponentModel;
using QalatAldhaman.Store.Admin.Models.Auth;
using QalatAldhaman.Store.Admin.Services;

namespace QalatAldhaman.Store.Admin.ViewModels;

public partial class LoginViewModel : ObservableObject
{
    private const int MaxFailedAttempts = 5;
    private const int LockoutSeconds = 30;

    private readonly ApiClient _apiClient;
    private readonly SessionService _sessionService;

    private int _failedAttempts;

    /// <summary>يُطلق عند نجاح تسجيل الدخول فعلياً (الجلسة مضبوطة بالفعل بـ SessionService عند هذه اللحظة).</summary>
    public event Action? LoginSucceeded;

    [ObservableProperty]
    private string _username = string.Empty;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    [ObservableProperty]
    private string _infoMessage = string.Empty;

    [ObservableProperty]
    private bool _isBusy;

    [ObservableProperty]
    private bool _isLoginEnabled = true;

    public LoginViewModel(ApiClient apiClient, SessionService sessionService)
    {
        _apiClient = apiClient;
        _sessionService = sessionService;
    }

    /// <summary>تُستدعى من App.xaml.cs عند إعادة العرض بعد انتهاء جلسة قسري (401 أو خمول).</summary>
    public void SetInfoMessage(string message) => InfoMessage = message;

    /// <summary>
    /// كلمة المرور تُمرَّر كمعامل بدل ربطها بخاصية Observable بالـ ViewModel عمداً — PasswordBox.Password
    /// ليست DependencyProperty (لأسباب أمنية بـ WPF)، وتجنّب تخزينها كخاصية ViewModel يمنع بقاءها بالذاكرة
    /// المُدارة لفترة أطول من اللازم أو انكشافها العرضي بأي أداة تفتيش/Binding مستقبلية.
    /// </summary>
    public async Task LoginAsync(string password)
    {
        if (!IsLoginEnabled || IsBusy)
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(password))
        {
            ErrorMessage = "الرجاء إدخال اسم المستخدم وكلمة المرور";
            return;
        }

        ErrorMessage = string.Empty;
        InfoMessage = string.Empty;
        IsBusy = true;
        IsLoginEnabled = false;

        try
        {
            var response = await _apiClient.PostAsJsonAsync(
                "/api/admin/auth/login",
                new LoginRequest { Username = Username, Password = password });

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<LoginResponse>(JsonDefaults.Options);
                if (result is not null)
                {
                    _failedAttempts = 0;
                    _sessionService.SetSession(result.Token, result.Username, result.FullName);
                    LoginSucceeded?.Invoke();
                    return;
                }
            }

            ErrorMessage = await ApiMessageReader.ReadAsync(response) ?? "بيانات الدخول غير صحيحة";
            RegisterFailedAttempt();
        }
        catch (Exception)
        {
            ErrorMessage = "تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى";
        }
        finally
        {
            IsBusy = false;
            if (_failedAttempts < MaxFailedAttempts)
            {
                IsLoginEnabled = true;
            }
        }
    }

    private void RegisterFailedAttempt()
    {
        _failedAttempts++;
        if (_failedAttempts >= MaxFailedAttempts)
        {
            _ = StartLockoutAsync();
        }
    }

    private async Task StartLockoutAsync()
    {
        IsLoginEnabled = false;
        ErrorMessage =
            $"تم تعطيل الدخول مؤقتاً بسبب {MaxFailedAttempts} محاولات فاشلة متتالية. حاول مرة أخرى بعد {LockoutSeconds} ثانية.";

        await Task.Delay(TimeSpan.FromSeconds(LockoutSeconds));

        _failedAttempts = 0;
        IsLoginEnabled = true;
        ErrorMessage = string.Empty;
    }
}
