using System.Linq;
using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using QalatAldhaman.Store.Admin.Services;
using QalatAldhaman.Store.Admin.ViewModels;
using QalatAldhaman.Store.Admin.Views;

namespace QalatAldhaman.Store.Admin;

/// <summary>
/// Interaction logic for App.xaml
/// </summary>
public partial class App : Application
{
    private IHost? _host;

    // WPF's default ShutdownMode (OnLastWindowClose) terminates the whole app the instant the
    // last open window closes — including MainWindow.Close() during a logout/session-expiry
    // transition, before the replacement LoginView is even shown. ShutdownMode is switched to
    // OnExplicitShutdown below, and this flag marks "this Close() is part of an intentional
    // window swap" so the matching Closed handler skips calling Shutdown() for it.
    private bool _isTransitioning;

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        ShutdownMode = ShutdownMode.OnExplicitShutdown;

        _host = Host.CreateDefaultBuilder()
            .ConfigureServices((context, services) =>
            {
                services.AddSingleton<SessionService>();

                services.AddHttpClient<ApiClient>((_, client) =>
                {
                    var baseUrl = context.Configuration["ApiSettings:BaseUrl"];
                    if (string.IsNullOrWhiteSpace(baseUrl))
                    {
                        throw new InvalidOperationException("ApiSettings:BaseUrl غير مُعرَّف بـ appsettings.json");
                    }

                    client.BaseAddress = new Uri(baseUrl);
                });

                // Transient: كل شاشة (Login/Main) تُنشأ من جديد في كل مرة تُعرض، لأن نافذة WPF
                // لا يمكن إعادة استخدامها بعد Close() (تسجيل الخروج أو انتهاء الجلسة يعيد إنشاء LoginView).
                services.AddTransient<LoginViewModel>();
                services.AddTransient<LoginView>();
                services.AddTransient<MainViewModel>();
                services.AddTransient<CategoriesViewModel>();
                services.AddTransient<ProductsViewModel>();
                services.AddTransient<OrdersViewModel>();
                services.AddTransient<ReviewsViewModel>();
                services.AddTransient<ContractsViewModel>();
                services.AddTransient<DashboardViewModel>();
                services.AddTransient<MainWindow>();
            })
            .Build();

        _host.Start();

        _host.Services.GetRequiredService<SessionService>().SessionEnded += OnSessionEnded;

        ShowLoginWindow();
    }

    private void ShowLoginWindow(string? infoMessage = null)
    {
        var loginView = _host!.Services.GetRequiredService<LoginView>();
        var viewModel = (LoginViewModel)loginView.DataContext;

        if (!string.IsNullOrWhiteSpace(infoMessage))
        {
            viewModel.SetInfoMessage(infoMessage);
        }

        viewModel.LoginSucceeded += () => OnLoginSucceeded(loginView);

        loginView.Closed += (_, _) =>
        {
            if (!_isTransitioning)
            {
                Shutdown();
            }

            _isTransitioning = false;
        };

        Current.MainWindow = loginView;
        loginView.Show();
    }

    private void OnLoginSucceeded(LoginView loginView)
    {
        _isTransitioning = true;

        var mainWindow = _host!.Services.GetRequiredService<MainWindow>();
        mainWindow.Closed += MainWindow_Closed;

        Current.MainWindow = mainWindow;
        mainWindow.Show();
        loginView.Close();
    }

    private void MainWindow_Closed(object? sender, EventArgs e)
    {
        if (!_isTransitioning)
        {
            Shutdown();
        }

        _isTransitioning = false;
    }

    private void OnSessionEnded(string? message)
    {
        Current.Dispatcher.Invoke(() =>
        {
            _isTransitioning = true;

            foreach (var window in Current.Windows.OfType<MainWindow>().ToList())
            {
                window.Close();
            }

            ShowLoginWindow(message);
        });
    }

    protected override void OnExit(ExitEventArgs e)
    {
        if (_host is not null)
        {
            _host.Services.GetRequiredService<SessionService>().SessionEnded -= OnSessionEnded;
            _host.Dispose();
        }

        base.OnExit(e);
    }
}
