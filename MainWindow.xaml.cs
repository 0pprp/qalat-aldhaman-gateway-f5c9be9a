using System.Windows;
using System.Windows.Threading;
using QalatAldhaman.Store.Admin.Services;
using QalatAldhaman.Store.Admin.ViewModels;

namespace QalatAldhaman.Store.Admin;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// </summary>
public partial class MainWindow : Window
{
    private static readonly TimeSpan IdleTimeout = TimeSpan.FromMinutes(20);

    private readonly SessionService _sessionService;
    private DispatcherTimer? _idleTimer;

    public MainWindow(MainViewModel viewModel, SessionService sessionService)
    {
        InitializeComponent();
        DataContext = viewModel;
        _sessionService = sessionService;

        Loaded += MainWindow_Loaded;
        Closed += MainWindow_Closed;
        PreviewMouseMove += ResetIdleTimer;
        PreviewKeyDown += ResetIdleTimer;
    }

    private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
    {
        StartIdleTimer();

        if (DataContext is MainViewModel viewModel)
        {
            await viewModel.VerifySessionAsync();
            await viewModel.LoadAllTabsAsync();
        }
    }

    private void MainWindow_Closed(object? sender, EventArgs e)
    {
        _idleTimer?.Stop();
    }

    private void StartIdleTimer()
    {
        _idleTimer = new DispatcherTimer { Interval = IdleTimeout };
        _idleTimer.Tick += (_, _) =>
        {
            _idleTimer?.Stop();
            _sessionService.ExpireSession("انتهت الجلسة بسبب الخمول الطويل، الرجاء تسجيل الدخول مجدداً");
        };
        _idleTimer.Start();
    }

    private void ResetIdleTimer(object sender, EventArgs e)
    {
        if (_idleTimer is null)
        {
            return;
        }

        _idleTimer.Stop();
        _idleTimer.Start();
    }
}
