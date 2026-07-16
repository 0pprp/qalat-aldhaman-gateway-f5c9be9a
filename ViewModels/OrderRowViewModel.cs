using System.Windows.Media;
using QalatAldhaman.Store.Admin.Models.Orders;

namespace QalatAldhaman.Store.Admin.ViewModels;

/// <summary>يغلّف OrderListItemDto بخصائص عرض جاهزة لعمود DataGrid.</summary>
public class OrderRowViewModel
{
    public OrderListItemDto Order { get; }

    public OrderRowViewModel(OrderListItemDto order)
    {
        Order = order;
    }

    public int Id => Order.Id;
    public string OrderNumber => Order.OrderNumber;
    public string CustomerName => Order.CustomerName;
    public string PhoneNumber => Order.PhoneNumber;
    public string ProductName => Order.ProductName;
    public string CategoryName => Order.CategoryName;
    public string GovernorateName => Order.GovernorateName;
    public string PurchaseMethodText => OrderDisplay.PurchaseMethodName(Order.PurchaseMethod);
    public string StatusText => OrderDisplay.StatusName(Order.Status);
    public Brush StatusColor => OrderDisplay.StatusColor(Order.Status);
    public decimal TotalPriceSnapshot => Order.TotalPriceSnapshot;
    public decimal? InstallmentPaymentAmountSnapshot => Order.InstallmentPaymentAmountSnapshot;
    public string CreatedAtText => Order.CreatedAt.ToLocalTime().ToString("yyyy-MM-dd HH:mm");
}
