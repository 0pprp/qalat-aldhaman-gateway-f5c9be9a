namespace QalatAldhaman.Store.Admin.Models.Dashboard;

public class DashboardStatsDto
{
    public Dictionary<string, int> OrdersByStatus { get; set; } = new();
    public int TotalOrders { get; set; }
    public int OrdersLast7Days { get; set; }
    public int OrdersLast30Days { get; set; }
    public List<CategoryOrderCountDto> OrdersByCategory { get; set; } = [];
    public Dictionary<string, int> OrdersByPurchaseMethod { get; set; } = new();
    public decimal EstimatedConfirmedRevenue { get; set; }
    public List<RecentOrderDto> RecentOrders { get; set; } = [];
    public int PendingReviewsCount { get; set; }
    public int ActiveProductsCount { get; set; }
    public int ActiveCategoriesCount { get; set; }
}
