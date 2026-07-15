using System.Windows;
using QalatAldhaman.Store.Admin.ViewModels;

namespace QalatAldhaman.Store.Admin.Views;

/// <summary>
/// Interaction logic for CategoryEditDialog.xaml
/// </summary>
public partial class CategoryEditDialog : Window
{
    public CategoryEditDialog(CategoryEditViewModel viewModel)
    {
        InitializeComponent();
        DataContext = viewModel;

        viewModel.SavedSuccessfully += () =>
        {
            DialogResult = true;
            Close();
        };
    }

    private void CancelButton_Click(object sender, RoutedEventArgs e)
    {
        DialogResult = false;
        Close();
    }
}
