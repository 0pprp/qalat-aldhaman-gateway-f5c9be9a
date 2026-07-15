using System.Windows;
using System.Windows.Input;
using QalatAldhaman.Store.Admin.ViewModels;

namespace QalatAldhaman.Store.Admin.Views;

/// <summary>
/// Interaction logic for LoginView.xaml
/// </summary>
public partial class LoginView : Window
{
    public LoginView(LoginViewModel viewModel)
    {
        InitializeComponent();
        DataContext = viewModel;
    }

    private async void LoginButton_Click(object sender, RoutedEventArgs e)
    {
        await SubmitAsync();
    }

    private async void PasswordInput_KeyDown(object sender, KeyEventArgs e)
    {
        if (e.Key == Key.Enter)
        {
            await SubmitAsync();
        }
    }

    private async Task SubmitAsync()
    {
        if (DataContext is LoginViewModel viewModel)
        {
            await viewModel.LoginAsync(PasswordInput.Password);
        }
    }
}
