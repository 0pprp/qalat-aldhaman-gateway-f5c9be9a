namespace QalatAldhaman.Store.Admin.Models.Contracts;

public class PurchaseMethodContractDto
{
    public string PurchaseMethod { get; set; } = string.Empty;
    public string? ContractPdfUrl { get; set; }
    public DateTime UpdatedAt { get; set; }
}
