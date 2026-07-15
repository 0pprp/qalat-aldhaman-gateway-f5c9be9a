using System.Windows;
using QalatAldhaman.Store.Admin.ViewModels;

namespace QalatAldhaman.Store.Admin.Views;

/// <summary>
/// Interaction logic for ProductEditDialog.xaml
/// </summary>
public partial class ProductEditDialog : Window
{
    private readonly ProductEditViewModel _viewModel;

    public ProductEditDialog(ProductEditViewModel viewModel)
    {
        InitializeComponent();
        DataContext = viewModel;
        _viewModel = viewModel;
    }

    private void CloseButton_Click(object sender, RoutedEventArgs e)
    {
        DialogResult = _viewModel.WasSaved;
        Close();
    }
}
