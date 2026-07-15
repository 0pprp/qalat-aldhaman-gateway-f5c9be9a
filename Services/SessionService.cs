namespace QalatAldhaman.Store.Admin.Services;

/// <summary>
/// يحمل التوكن وبيانات المستخدم بالذاكرة فقط طوال عمر التطبيق (Singleton) — لا كتابة على القرص
/// بأي شكل. يُفرَّغ كل شيء عند إغلاق التطبيق تلقائياً (لا استمرارية بين مرات التشغيل).
/// </summary>
public class SessionService
{
    public string? Token { get; private set; }
    public string? Username { get; private set; }
    public string? FullName { get; private set; }
    public bool IsAuthenticated => !string.IsNullOrEmpty(Token);

    /// <summary>
    /// يُطلق عند انتهاء الجلسة: null = تسجيل خروج عادي بقرار المستخدم (بدون رسالة)،
    /// نص = إنهاء قسري (توكن مرفوض من الباك اند 401 أو خمول طويل) مع رسالة تُعرض بشاشة الدخول.
    /// </summary>
    public event Action<string?>? SessionEnded;

    public void SetSession(string token, string username, string fullName)
    {
        Token = token;
        Username = username;
        FullName = fullName;
    }

    public void Logout()
    {
        Clear();
        SessionEnded?.Invoke(null);
    }

    public void ExpireSession(string reason)
    {
        Clear();
        SessionEnded?.Invoke(reason);
    }

    private void Clear()
    {
        Token = null;
        Username = null;
        FullName = null;
    }
}
