export interface AmazonProduct {
  asin: string;
  title: string;
  currentPrice: number | null;
  originalPrice: number | null;
  currency: string;
  shippingPrice: number | null;
  freeShippingOver99: boolean;
  importCharges: number | null;
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
  bestSellersRank: number | null;
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
