using QalatAldhaman.Store.Admin.Models.Products;

namespace QalatAldhaman.Store.Admin.ViewModels;

/// <summary>يغلّف ProductDto بخصائص عرض جاهزة لعمود DataGrid.</summary>
public class ProductRowViewModel
{
    public ProductDto Product { get; }

    public ProductRowViewModel(ProductDto product)
    {
        Product = product;
    }

    public string Name => Product.Name;

    public string CategoryName => Product.CategoryName;

    public string CashPriceText => Product.CashPrice?.ToString("N0") ?? "—";

    public string MonthlyPriceText => Product.MonthlyTotalPrice.HasValue && Product.MonthlyPaymentAmount.HasValue
        ? $"{Product.MonthlyTotalPrice:N0} كلي / {Product.MonthlyPaymentAmount:N0} دفعة"
        : "—";

    public string DailyPriceText => Product.DailyTotalPrice.HasValue && Product.DailyPaymentAmount.HasValue
        ? $"{Product.DailyTotalPrice:N0} كلي / {Product.DailyPaymentAmount:N0} دفعة"
        : "—";

    public string StatusText => Product.IsActive ? "فعّال" : "معطّل";
}
