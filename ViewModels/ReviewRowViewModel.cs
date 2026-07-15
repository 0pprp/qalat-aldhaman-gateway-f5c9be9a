using QalatAldhaman.Store.Admin.Models.Reviews;

namespace QalatAldhaman.Store.Admin.ViewModels;

/// <summary>يغلّف ReviewDto بخصائص عرض جاهزة لعمود DataGrid.</summary>
public class ReviewRowViewModel
{
    public ReviewDto Review { get; }

    public ReviewRowViewModel(ReviewDto review)
    {
        Review = review;
    }

    public int Id => Review.Id;
    public string CustomerName => Review.CustomerName;
    public string ProductName => Review.ProductName;
    public string RatingText => new string('★', Review.Rating) + new string('☆', 5 - Review.Rating);
    public string Comment => Review.Comment ?? string.Empty;
    public string StatusText => Review.IsApproved ? "معتمد" : "بانتظار الموافقة";
    public bool IsApproveVisible => !Review.IsApproved;
}
