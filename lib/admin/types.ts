export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'READY' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type DeliveryType = 'HOME' | 'SCHOOL' | 'CITY_CENTER' | 'PICKUP';

export interface AdminProduct {
  id: string;
  slug: string;
  name_fi: string;
  name_en: string;
  description_fi: string;
  description_en: string;
  composition_fi?: string | null;
  composition_en?: string | null;
  careInfo_fi?: string | null;
  careInfo_en?: string | null;
  priceSmall: number;
  priceLarge?: number | null;
  imageUrl: string;
  imageUrls: string[];
  categoryId: string;
  categoryName: string;
  occasions: string[];
  color?: string | null;
  flowerCount?: number | null;
  heightCm?: number | null;
  popularity: number;
  inStock: boolean;
  isFeatured: boolean;
  isFuneral: boolean;
  isWedding: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { orderItems: number };
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  name_fi: string;
  name_en: string;
  size: 'SMALL' | 'LARGE';
  quantity: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  deliveryAddress?: string | null;
  deliveryCity?: string | null;
  deliveryNote?: string | null;
  scheduledAt?: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paypalOrderId?: string | null;
  giftCardCode?: string | null;
  giftCardDiscount?: number | null;
  notes?: string | null;
  items: AdminOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminPromoCode {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  maxUses?: number | null;
  maxUsesPerUser?: number | null;
  usageCount: number;
  applicableTo: 'ALL' | 'CATEGORIES' | 'PRODUCTS';
  categoryIds: string[];
  productIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  slug: string;
  name_fi: string;
  name_en: string;
  description_fi?: string | null;
  description_en?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  productCount?: number;
  createdAt: string;
}

export interface DashboardStats {
  revenue: { today: number; week: number; month: number };
  orders: { total: number; pending: number; confirmed: number; processing: number; ready: number; delivered: number; cancelled: number };
  avgOrderValue: number;
  topProducts: { id: string; name: string; count: number; revenue: number }[];
  recentOrders: Pick<AdminOrder, 'id' | 'orderNumber' | 'customerName' | 'total' | 'status' | 'createdAt'>[];
  salesByDay: { date: string; revenue: number; orders: number }[];
  alerts: { type: 'warning' | 'info'; message: string }[];
}

export interface SalesAnalytics {
  salesByDay: { date: string; revenue: number; orders: number; avgOrder: number }[];
  topProducts: { id: string; name: string; count: number; revenue: number }[];
  topCategories: { name: string; count: number; revenue: number }[];
  currentRevenue: number;
  previousRevenue: number;
  cancelledCount: number;
  totalOrders: number;
}

export interface StoreSettingsData {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  telegram: string;
  deliveryFee: number;
  minOrderAmount: number;
  weekdays: string;
  saturday: string;
  sunday: string;
  confirmationText: string;
}
