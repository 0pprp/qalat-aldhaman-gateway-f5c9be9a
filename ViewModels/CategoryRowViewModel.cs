using QalatAldhaman.Store.Admin.Models.Categories;

namespace QalatAldhaman.Store.Admin.ViewModels;

/// <summary>يغلّف CategoryDto بخصائص عرض جاهزة لعمود DataGrid (بدون تلويث الـ DTO نفسه بمنطق واجهة).</summary>
public class CategoryRowViewModel
{
    public CategoryDto Category { get; }

    public CategoryRowViewModel(CategoryDto category)
    {
        Category = category;
    }

    public string Name => Category.Name;

    public string PaymentMethodsSummary
    {
        get
        {
            var methods = new List<string>();
            if (Category.AllowsCash) methods.Add("نقد");
            if (Category.AllowsMonthlyInstallment) methods.Add("شهري");
            if (Category.AllowsDailyInstallment) methods.Add("يومي");
            return methods.Count > 0 ? string.Join("، ", methods) : "لا يوجد";
        }
    }

    public string RequiresShopOwnerText => Category.RequiresShopOwner ? "نعم" : "لا";

    public string StatusText => Category.IsActive ? "فعّالة" : "معطّلة";
}
