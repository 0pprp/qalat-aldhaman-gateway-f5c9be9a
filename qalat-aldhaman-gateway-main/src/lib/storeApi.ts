import { apiFetch } from '@/lib/api';
import type {
  CategoryPublic,
  CreateOrderRequest,
  CreateOrderResponse,
  Governorate,
  OrderLookupResult,
  ProductDetail,
  ProductListItem,
} from '@/types/store';

export const fetchCategories = () => apiFetch<CategoryPublic[]>('/api/categories');

export const fetchCategoryProducts = (slug: string) =>
  apiFetch<ProductListItem[]>(`/api/categories/${encodeURIComponent(slug)}/products`);

export const fetchProductDetail = (id: string | number) => apiFetch<ProductDetail>(`/api/products/${id}`);

export const fetchGovernorates = () => apiFetch<Governorate[]>('/api/governorates');

export const createOrder = (payload: CreateOrderRequest) =>
  apiFetch<CreateOrderResponse>('/api/orders', { method: 'POST', body: payload });

export const fetchOrdersByPhone = (phone: string) =>
  apiFetch<OrderLookupResult[]>(`/api/orders/lookup?phone=${encodeURIComponent(phone)}`);
