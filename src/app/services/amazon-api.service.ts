import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, tap, forkJoin } from 'rxjs';
import { AmazonProduct, SearchResponse } from '../models/product.model';

interface RawProduct {
  aboutItem: string[];
  asin: string;
  category: string;
  currency: string;
  currentPrice: number;
  freeShippingOver99: boolean;
  imageUrls: string[];
  importCharges: number;
  inStock: boolean;
  originalPrice: number | null;
  rating: number;
  ratingCount: number;
  region: 'US' | 'ES';
  shippingPrice: number;
  shipsToArgentina: boolean;
  title: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class AmazonApiService {

  private readonly http = inject(HttpClient);

  private readonly affiliateTagUS = 'precioradar-20';
  private readonly affiliateTagES = 'precioradar-21';

  private readonly products = signal<AmazonProduct[]>([]);
  private loaded = false;

  private readonly categoryIconMap: Record<string, string> = {
    'Electrónica': 'pi pi-mobile',
    'Electrónicos de Oficina': 'pi pi-desktop',
    'Hogar y Cocina': 'pi pi-home',
    'Deportes y Actividades al Aire Libre': 'pi pi-sun',
    'Salud y Hogar': 'pi pi-heart',
    'Ropa, Zapatos y Joyería': 'pi pi-user',
    'Herramientas y Mejoras del Hogar': 'pi pi-wrench',
    'Belleza y Cuidado Personal': 'pi pi-sparkles',
    'Cuidado de Boca': 'pi pi-heart',
    'Juguetes y Juegos': 'pi pi-gift'
  };

  readonly categoryOptions = computed(() => {
    const uniqueCategories = [...new Set(this.products().map(p => p.category))].sort();
    return [
      { label: 'Todas las categorías', value: '', icon: 'pi pi-th-large' },
      ...uniqueCategories.map(cat => ({
        label: cat,
        value: cat,
        icon: this.categoryIconMap[cat] || 'pi pi-tag'
      }))
    ];
  });

  private loadProducts(): Observable<AmazonProduct[]> {
    if (this.loaded) {
      return of(this.products());
    }
    return forkJoin([
      this.http.get<RawProduct[]>('products-us.json'),
      this.http.get<RawProduct[]>('products-es.json')
    ]).pipe(
      map(([us, es]) => [...us, ...es].filter(p => p.shipsToArgentina).map(p => this.mapProduct(p))),
      tap(products => {
        this.products.set(products);
        this.loaded = true;
      })
    );
  }

  private mapProduct(raw: RawProduct): AmazonProduct {
    const region = raw.region ?? 'US';
    const tag = region === 'ES' ? this.affiliateTagES : this.affiliateTagUS;
    const separator = raw.url.includes('?') ? '&' : '?';

    return {
      asin: raw.asin,
      title: raw.title,
      currentPrice: raw.currentPrice,
      originalPrice: raw.originalPrice,
      currency: raw.currency,
      shippingPrice: raw.shippingPrice,
      freeShippingOver99: raw.freeShippingOver99,
      importCharges: raw.importCharges,
      shipsToArgentina: raw.shipsToArgentina,
      imageUrls: raw.imageUrls,
      rating: raw.rating,
      ratingCount: raw.ratingCount,
      inStock: raw.inStock,
      category: raw.category,
      url: `${raw.url}${separator}tag=${tag}`,
      aboutItem: raw.aboutItem ?? [],
      region
    };
  }

  getProductCount(region: string): number {
    return this.getProductsByRegion(region).length;
  }

  private getProductsByRegion(region: string): AmazonProduct[] {
    const all = this.products();
    if (region === 'ALL') return all;
    return all.filter(p => p.region === region);
  }

  searchProducts(query: string, page: number = 1, limit: number = 10, region: string = 'US', category?: string): Observable<SearchResponse> {
    return this.loadProducts().pipe(
      map(() => this.getMockSearchResults(query, page, limit, region, category))
    );
  }

  getTopSellingProducts(category?: string, region: string = 'US'): Observable<SearchResponse> {
    return this.loadProducts().pipe(
      map(() => {
        const regionProducts = this.getProductsByRegion(region);
        const filteredProducts = category
          ? regionProducts.filter(p => p.category.toLowerCase().includes(category.toLowerCase()))
          : regionProducts;

        return {
          products: filteredProducts,
          totalResults: filteredProducts.length,
          page: 1,
          totalPages: Math.ceil(filteredProducts.length / 10)
        };
      })
    );
  }

  getProductsByAsins(items: { asin: string; region: string }[]): Observable<AmazonProduct[]> {
    return this.loadProducts().pipe(
      map(allProducts => {
        return items
          .map(item => allProducts.find(p => p.asin === item.asin))
          .filter((p): p is AmazonProduct => p !== undefined);
      })
    );
  }

  private getMockSearchResults(query: string, page: number, limit: number, region: string = 'US', category?: string): SearchResponse {
    const regionProducts = this.getProductsByRegion(region);
    let filteredProducts = regionProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      totalResults: filteredProducts.length,
      page,
      totalPages: Math.ceil(filteredProducts.length / limit)
    };
  }

}
