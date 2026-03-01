import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, tap, forkJoin } from 'rxjs';
import { AmazonProduct, SearchResponse } from '../models/product.model';

interface RawProduct {
  aboutItem: string[];
  asin: string;
  bestSellersRank: number | null;
  category: string;
  currency: string;
  currentPrice: number | null;
  freeShippingOver99: boolean;
  imageUrls: string[] | null;
  importCharges: number | null;
  inStock: boolean;
  originalPrice: number | null;
  rating: number | null;
  ratingCount: number | null;
  region: 'US' | 'ES';
  shippingPrice: number | null;
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

  readonly categoryOptions = [
    { label: 'Todas las categorías', value: '', icon: 'pi pi-th-large' },
    { label: 'Electrónica', value: 'Electrónica', icon: 'pi pi-microchip' },
    { label: 'Computadoras y Accesorios', value: 'Computadoras y Accesorios', icon: 'pi pi-desktop' },
    { label: 'Celulares y Accesorios', value: 'Celulares y Accesorios', icon: 'pi pi-phone' },
    { label: 'Hogar y Cocina', value: 'Hogar y Cocina', icon: 'pi pi-home' },
    { label: 'Cocina y Comedor', value: 'Cocina y Comedor', icon: 'pi pi-shopping-bag' },
    { label: 'Deportes y Actividades al Aire Libre', value: 'Deportes y Actividades al Aire Libre', icon: 'pi pi-trophy' },
    { label: 'Juguetes y Juegos', value: 'Juguetes y Juegos', icon: 'pi pi-gift' },
    { label: 'Videojuegos', value: 'Videojuegos', icon: 'pi pi-play' },
    { label: 'Cámaras y Fotografía', value: 'Cámaras y Fotografía', icon: 'pi pi-camera' },
    { label: 'Productos de Oficina', value: 'Productos de Oficina', icon: 'pi pi-briefcase' },
    { label: 'Herramientas y Mejoras del Hogar', value: 'Herramientas y Mejoras del Hogar', icon: 'pi pi-wrench' },
    { label: 'Automotriz', value: 'Automotriz', icon: 'pi pi-car' },
    { label: 'Belleza y Cuidado Personal', value: 'Belleza y Cuidado Personal', icon: 'pi pi-sparkles' },
    { label: 'Productos para Bebé', value: 'Productos para Bebé', icon: 'pi pi-heart' },
    { label: 'Ropa, Zapatos y Joyería', value: 'Ropa, Zapatos y Joyería', icon: 'pi pi-tag' },
    { label: 'Salud y Hogar', value: 'Salud y Hogar', icon: 'pi pi-heart-fill' },
    { label: 'Productos para Animales', value: 'Productos para Animales', icon: 'pi pi-star' },
    { label: 'Patio, Césped y Jardín', value: 'Patio, Césped y Jardín', icon: 'pi pi-sun' },
    { label: 'Electrodomésticos', value: 'Electrodomésticos', icon: 'pi pi-bolt' },
    { label: 'Arte, Manualidades y Costura', value: 'Arte, Manualidades y Costura', icon: 'pi pi-palette' },
    { label: 'Instrumentos Musicales', value: 'Instrumentos Musicales', icon: 'pi pi-headphones' },
    { label: 'Industrial y Científico', value: 'Industrial y Científico', icon: 'pi pi-cog' },
    { label: 'Dispositivos Amazon y Accesorios', value: 'Dispositivos Amazon y Accesorios', icon: 'pi pi-tablet' },
    { label: 'Libros', value: 'Libros', icon: 'pi pi-book' },
    { label: 'Películas y TV', value: 'Películas y TV', icon: 'pi pi-video' },
    { label: 'CDs y Vinilo', value: 'CDs y Vinilo', icon: 'pi pi-volume-up' },
    { label: 'Coleccionables de Entretenimiento', value: 'Coleccionables de Entretenimiento', icon: 'pi pi-ticket' },
    { label: 'Coleccionables Deportivos', value: 'Coleccionables Deportivos', icon: 'pi pi-flag' },
    { label: 'Productos Hechos a Mano', value: 'Productos Hechos a Mano', icon: 'pi pi-pencil' },
    { label: 'Monedas Coleccionables', value: 'Monedas Coleccionables', icon: 'pi pi-bitcoin' },
    { label: 'Software', value: 'Software', icon: 'pi pi-code' },
  ];

  private loadProducts(): Observable<AmazonProduct[]> {
    if (this.loaded) {
      return of(this.products());
    }
    return forkJoin([
      this.http.get<RawProduct[]>('products-us.json'),
      this.http.get<RawProduct[]>('products-es.json')
    ]).pipe(
      map(([us, es]) => [...us, ...es].filter(p => p.shipsToArgentina && (p.currentPrice ?? 0) > 0).map(p => this.mapProduct(p))),
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
      imageUrls: raw.imageUrls ?? [],
      rating: raw.rating ?? 0,
      ratingCount: raw.ratingCount ?? 0,
      inStock: raw.inStock,
      category: raw.category,
      url: `${raw.url}${separator}tag=${tag}`,
      addToCartUrl: `https://www.amazon.${region === 'ES' ? 'es' : 'com'}/gp/aws/cart/add.html?tag=${tag}&ASIN.1=${raw.asin}&Quantity.1=1`,
      aboutItem: raw.aboutItem ?? [],
      region,
      bestSellersRank: raw.bestSellersRank ?? null
    };
  }

  getAllProducts(): AmazonProduct[] {
    return this.products();
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
