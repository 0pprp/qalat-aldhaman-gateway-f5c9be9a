using System.Windows;
using QalatAldhaman.Store.Admin.ViewModels;

namespace QalatAldhaman.Store.Admin.Views;

/// <summary>
/// Interaction logic for OrderDetailDialog.xaml
/// </summary>
public partial class OrderDetailDialog : Window
{
    public OrderDetailDialog(OrderDetailViewModel viewModel)
    {
        InitializeComponent();
        DataContext = viewModel;
    }
}
