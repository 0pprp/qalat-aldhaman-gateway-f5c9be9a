using System.Windows.Media;
using QalatAldhaman.Store.Admin.Models.Dashboard;

namespace QalatAldhaman.Store.Admin.ViewModels;

public class RecentOrderRowViewModel
{
    public RecentOrderDto Order { get; }

    public RecentOrderRowViewModel(RecentOrderDto order)
    {
        Order = order;
    }

    public int Id => Order.Id;
    public string OrderNumber => Order.OrderNumber;
    public string CustomerName => Order.CustomerName;
    public string ProductName => Order.ProductName;
    public string StatusText => OrderDisplay.StatusName(Order.Status);
    public Brush StatusColor => OrderDisplay.StatusColor(Order.Status);
    public string CreatedAtText => Order.CreatedAt.ToLocalTime().ToString("yyyy-MM-dd HH:mm");
}
