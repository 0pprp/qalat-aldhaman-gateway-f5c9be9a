using QalatAldhaman.Store.Admin.Models.Products;

namespace QalatAldhaman.Store.Admin.ViewModels;

/// <summary>يغلّف ProductImageDto مع رابط مطلق جاهز للعرض المباشر بعنصر Image.</summary>
public class ProductImageRowViewModel
{
    public ProductImageDto Image { get; }

    public string? ResolvedUrl { get; }

    public ProductImageRowViewModel(ProductImageDto image, string? resolvedUrl)
    {
        Image = image;
        ResolvedUrl = resolvedUrl;
    }
}
