using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace QalatAldhaman.Store.Admin.Services;

/// <summary>
/// غلاف حول HttpClient لكل الاتصال بـ QalatAldhaman.Store.Api. الـ BaseAddress يُضبط عبر
/// appsettings.json (ApiSettings:BaseUrl) وقت التسجيل بحاوية DI (راجع App.xaml.cs).
/// يقرأ التوكن من SessionService (مصدر الحقيقة الوحيد للجلسة) ويُرفقه تلقائياً بكل طلب.
/// إن رجع 401 لطلب كان يحمل توكناً فعلياً، تُعتبر الجلسة منتهية الصلاحية وتُفرَّغ فوراً.
/// </summary>
public class ApiClient
{
    private readonly HttpClient _httpClient;
    private readonly SessionService _sessionService;

    public ApiClient(HttpClient httpClient, SessionService sessionService)
    {
        _httpClient = httpClient;
        _sessionService = sessionService;
    }

    private void ApplyAuthHeader()
    {
        _httpClient.DefaultRequestHeaders.Authorization =
            string.IsNullOrWhiteSpace(_sessionService.Token)
                ? null
                : new AuthenticationHeaderValue("Bearer", _sessionService.Token);
    }

    private async Task<HttpResponseMessage> ExecuteAsync(Func<Task<HttpResponseMessage>> action)
    {
        var hadToken = !string.IsNullOrWhiteSpace(_sessionService.Token);
        ApplyAuthHeader();

        var response = await action();

        // 401 على طلب كان يحمل توكناً بالفعل = جلسة منتهية (وليس فشل تسجيل دخول عادي، الذي لا يحمل توكناً أصلاً).
        if (hadToken && response.StatusCode == HttpStatusCode.Unauthorized)
        {
            _sessionService.ExpireSession("انتهت الجلسة، الرجاء تسجيل الدخول مجدداً");
        }

        return response;
    }

    public Task<HttpResponseMessage> GetAsync(string requestUri, CancellationToken cancellationToken = default) =>
        ExecuteAsync(() => _httpClient.GetAsync(requestUri, cancellationToken));

    public Task<HttpResponseMessage> PostAsJsonAsync<TValue>(
        string requestUri,
        TValue value,
        CancellationToken cancellationToken = default) =>
        ExecuteAsync(() => _httpClient.PostAsJsonAsync(requestUri, value, JsonDefaults.Options, cancellationToken));

    public Task<HttpResponseMessage> PutAsJsonAsync<TValue>(
        string requestUri,
        TValue value,
        CancellationToken cancellationToken = default) =>
        ExecuteAsync(() => _httpClient.PutAsJsonAsync(requestUri, value, JsonDefaults.Options, cancellationToken));

    public Task<HttpResponseMessage> DeleteAsync(string requestUri, CancellationToken cancellationToken = default) =>
        ExecuteAsync(() => _httpClient.DeleteAsync(requestUri, cancellationToken));

    /// <summary>يرفع ملفاً كـ multipart/form-data (حقل "file") — يطابق POST /api/uploads?folder=... بالباك اند.</summary>
    public Task<HttpResponseMessage> PostFileAsync(
        string requestUri,
        string filePath,
        CancellationToken cancellationToken = default) =>
        ExecuteAsync(async () =>
        {
            var bytes = await File.ReadAllBytesAsync(filePath, cancellationToken);
            using var content = new MultipartFormDataContent();
            using var byteContent = new ByteArrayContent(bytes);
            content.Add(byteContent, "file", Path.GetFileName(filePath));
            return await _httpClient.PostAsync(requestUri, content, cancellationToken);
        });

    /// <summary>
    /// يحوّل رابطاً نسبياً قادماً من الباك اند (مثل /uploads/categories/x.png) لرابط كامل.
    /// يستخدم أصل الـ BaseAddress فقط (Scheme+Authority) وليس مساره الفرعي الكامل — الملفات
    /// الساكنة (UseStaticFiles بدون RequestPath، راجع Program.cs بالباك اند) تُخدَّم من جذر
    /// الموقع مباشرة (https://qalataldhaman.com/uploads/...) وليس تحت /api كما BaseUrl نفسه
    /// (https://qalataldhaman.com/api)، فتجميعهما نصياً كان سينتج مساراً خاطئاً
    /// (.../api/uploads/... بدل .../uploads/...).
    /// </summary>
    public string? ResolveMediaUrl(string? path)
    {
        if (string.IsNullOrWhiteSpace(path))
        {
            return null;
        }

        if (Uri.IsWellFormedUriString(path, UriKind.Absolute))
        {
            return path;
        }

        var baseAddress = _httpClient.BaseAddress;
        if (baseAddress is null)
        {
            return path;
        }

        var origin = $"{baseAddress.Scheme}://{baseAddress.Authority}";
        return $"{origin}{path}";
    }
}
