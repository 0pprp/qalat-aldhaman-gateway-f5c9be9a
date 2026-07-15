namespace QalatAldhaman.Store.Admin.Models.Products;

public class AddProductImageRequest
{
    public string ImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
