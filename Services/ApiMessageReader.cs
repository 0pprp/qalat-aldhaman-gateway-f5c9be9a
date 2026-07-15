using System.Net.Http;
using System.Net.Http.Json;
using QalatAldhaman.Store.Admin.Models;

namespace QalatAldhaman.Store.Admin.Services;

/// <summary>
/// يقرأ حقل "message" من جسم الاستجابة — يُستخدم لكل من رسائل الخطأ (400/404/...) ورسائل النجاح
/// التوضيحية (مثل تنبيه "الفئة تحتوي منتجات، تم تعطيلها بدل حذفها" الذي يرجع بحالة 200 ناجحة).
/// </summary>
public static class ApiMessageReader
{
    public static async Task<string?> ReadAsync(HttpResponseMessage response)
    {
        try
        {
            var body = await response.Content.ReadFromJsonAsync<ApiErrorResponse>(JsonDefaults.Options);
            return string.IsNullOrWhiteSpace(body?.Message) ? null : body.Message;
        }
        catch
        {
            return null;
        }
    }
}
