export interface AmazonProduct {
  asin: string;
  title: string;
  price: {
    current: number;
    original?: number;
    currency: string;
  };
  shipping: {
    price: number;
    currency: string;
    destination: string;
    freeAbove99?: boolean;
  };
  images: string[];
  rating: number;
  reviewCount: number;
  availability: string;
  category: string;
  url: string;
  description?: string;
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
