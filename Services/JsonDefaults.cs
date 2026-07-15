using System.Text.Json;

namespace QalatAldhaman.Store.Admin.Services;

/// <summary>
/// System.Net.Http.Json's ReadFromJsonAsync/PostAsJsonAsync overloads بدون options صريحة تستخدم
/// JsonSerializerOptions افتراضية حساسة لحالة الأحرف (PropertyNameCaseInsensitive = false) — بينما
/// الباك اند يرجع camelCase (token, fullName...) ونماذجنا هنا PascalCase. بدون هذا الإعداد الصريح
/// ستفشل كل عمليات التحويل بصمت (خصائص تبقى فارغة بدل استثناء واضح). JsonSerializerDefaults.Web
/// يضبط PropertyNameCaseInsensitive=true وCamelCase تلقائياً بالاتجاهين.
/// </summary>
public static class JsonDefaults
{
    public static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web);
}
