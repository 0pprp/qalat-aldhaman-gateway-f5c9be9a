// يطابق ردود QalatAldhaman.Store.Api بالضبط (camelCase تلقائي من System.Text.Json).

export interface CategoryPublic {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
}

export interface ProductListItem {
  id: number;
  name: string;
  cashPrice: number | null;
  monthlyTotalPrice: number | null;
  monthlyPaymentAmount: number | null;
  dailyTotalPrice: number | null;
  dailyPaymentAmount: number | null;
  imageUrl: string | null;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

export interface CategoryDetail {
  id: number;
  name: string;
  slug: string;
  allowsCash: boolean;
  allowsMonthlyInstallment: boolean;
  allowsDailyInstallment: boolean;
  requiresShopOwner: boolean;
  minInvoiceCash: number | null;
  minInvoiceInstallment: number | null;
  hasCustomProductField: boolean;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string | null;
  cashPrice: number | null;
  monthlyTotalPrice: number | null;
  monthlyPaymentAmount: number | null;
  monthlyDownPayment: number | null;
  rafidainTotalPrice: number | null;
  rafidainPaymentAmount: number | null;
  rafidainDownPayment: number | null;
  dailyTotalPrice: number | null;
  dailyPaymentAmount: number | null;
  contractPdfUrl: string | null;
  images: ProductImage[];
  category: CategoryDetail;
}

export interface Governorate {
  id: number;
  name: string;
}

export type PurchaseMethod = 'Cash' | 'MonthlyInstallment' | 'MonthlyRafidain' | 'DailyInstallment';
export type MediaType = 'Photo' | 'Video';
export type OrderStatus = 'Pending' | 'ContactedByRep' | 'Confirmed' | 'Rejected' | 'Completed';

export interface CreateOrderRequest {
  productId: number;
  purchaseMethod: PurchaseMethod;
  customerName: string;
  phoneNumber: string;
  governorateId: number;
  shopName?: string;
  shopAddress?: string;
  homeAddress?: string;
  nearestLandmark?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  gpsLat?: number;
  gpsLng?: number;
  customProductDescription?: string;
}

export interface CreateOrderResponse {
  orderNumber: string;
  status: OrderStatus;
  contractPdfUrl: string | null;
}

export interface OrderLookupResult {
  orderNumber: string;
  productName: string;
  purchaseMethod: PurchaseMethod;
  totalPriceSnapshot: number;
  installmentPaymentAmountSnapshot: number | null;
  status: OrderStatus;
  createdAt: string;
  contractPdfUrl: string | null;
}
