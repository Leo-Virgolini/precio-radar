export interface AmazonProduct {
  asin: string;
  title: string;
  currentPrice: number;
  originalPrice: number | null;
  currency: string;
  shippingPrice: number;
  freeShippingOver99: boolean;
  importCharges: number;
  shipsToArgentina: boolean;
  imageUrls: string[];
  rating: number;
  ratingCount: number;
  inStock: boolean;
  category: string;
  url: string;
  addToCartUrl: string;
  aboutItem: string[];
  region: 'US' | 'ES';
}

export interface SearchResponse {
  products: AmazonProduct[];
  totalResults: number;
  page: number;
  totalPages: number;
}

export interface FavoriteItem {
  asin: string;
  region: 'US' | 'ES';
  dateAdded: number;
}
