
export type AppRole = 'buyer' | 'seller' | 'admin';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  userImage?: string;
  isVerified: boolean;
}

export interface Order {
  id: string;
  productName: string;
  sellerName: string;
  date: string;
  status: 'Completed' | 'Processing' | 'Pending';
  thumbnail: string;
}

export interface SellerMetric {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  timeframe?: string;
}
