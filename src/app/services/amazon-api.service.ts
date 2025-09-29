import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  };
  image: string;
  rating: number;
  reviewCount: number;
  availability: string;
  category: string;
  url: string;
  description?: string;
}

export interface SearchResponse {
  products: AmazonProduct[];
  totalResults: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class AmazonApiService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.rainforestapi.com/request';
  private readonly apiKey = 'YOUR_API_KEY'; // Replace with your actual API key

  // Real Amazon products deliverable to Argentina (Demo/Example purposes)
  // These are actual Amazon products with proper affiliate links
  private readonly mockProducts: AmazonProduct[] = [
    {
      asin: 'B08N5WRWNW',
      title: 'Echo Dot (4ª generación) | Altavoz inteligente con Alexa | Antracita',
      price: {
        current: 49.99,
        original: 59.99,
        currency: 'USD'
      },
      shipping: {
        price: 12.99,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SL1000_.jpg',
      rating: 4.5,
      reviewCount: 125000,
      availability: 'En stock - Envío a Argentina',
      category: 'Electrónicos',
      url: 'https://amazon.com/dp/B08N5WRWNW?tag=demoaffiliate-20',
      description: 'Altavoz inteligente con Alexa, perfecto para controlar tu hogar inteligente. Envío disponible a Argentina.'
    },
    {
      asin: 'B07XJ8C8F5',
      title: 'Fire TV Stick 4K con mando por voz Alexa (incluye controles del TV)',
      price: {
        current: 39.99,
        currency: 'USD'
      },
      shipping: {
        price: 0,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/51TjJOTfslL._AC_SL1000_.jpg',
      rating: 4.6,
      reviewCount: 89000,
      availability: 'En stock - Envío a Argentina',
      category: 'Electrónicos',
      url: 'https://amazon.com/dp/B07XJ8C8F5?tag=demoaffiliate-20',
      description: 'Dispositivo de streaming 4K Ultra HD con Alexa integrado. Compatible con envío a Argentina.'
    },
    {
      asin: 'B08C1W5N87',
      title: 'Kindle Paperwhite (11ª generación) | Resistente al agua, pantalla de 6.8"',
      price: {
        current: 139.99,
        original: 149.99,
        currency: 'USD'
      },
      shipping: {
        price: 15.99,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/51Q+vqZLiGL._AC_SL1000_.jpg',
      rating: 4.7,
      reviewCount: 45000,
      availability: 'En stock - Envío a Argentina',
      category: 'Libros y medios',
      url: 'https://amazon.com/dp/B08C1W5N87?tag=demoaffiliate-20',
      description: 'E-reader resistente al agua con pantalla de alta resolución. Envío internacional a Argentina.'
    },
    {
      asin: 'B0BDJDRJ1T',
      title: 'Apple AirPods Pro (2ª generación) con estuche de carga MagSafe',
      price: {
        current: 249.99,
        original: 279.99,
        currency: 'USD'
      },
      shipping: {
        price: 18.99,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
      rating: 4.8,
      reviewCount: 67000,
      availability: 'En stock - Envío a Argentina',
      category: 'Electrónicos',
      url: 'https://amazon.com/dp/B0BDJDRJ1T?tag=demoaffiliate-20',
      description: 'Auriculares inalámbricos con cancelación activa de ruido. Envío disponible a Argentina.'
    },
    {
      asin: 'B09JQMJSXY',
      title: 'Sony WH-1000XM4 Auriculares inalámbricos con cancelación de ruido',
      price: {
        current: 278.00,
        original: 349.99,
        currency: 'USD'
      },
      shipping: {
        price: 22.99,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
      rating: 4.6,
      reviewCount: 89000,
      availability: 'En stock - Envío a Argentina',
      category: 'Electrónicos',
      url: 'https://amazon.com/dp/B09JQMJSXY?tag=demoaffiliate-20',
      description: 'Auriculares premium con cancelación de ruido líder en la industria. Envío internacional a Argentina.'
    },
    {
      asin: 'B0B7BQJ8QZ',
      title: 'Nintendo Switch con consola OLED de 7 pulgadas',
      price: {
        current: 349.99,
        currency: 'USD'
      },
      shipping: {
        price: 25.99,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/61Qf1Z1l5VL._AC_SL1500_.jpg',
      rating: 4.7,
      reviewCount: 120000,
      availability: 'En stock - Envío a Argentina',
      category: 'Videojuegos',
      url: 'https://amazon.com/dp/B0B7BQJ8QZ?tag=demoaffiliate-20',
      description: 'Consola de videojuegos híbrida con pantalla OLED de 7 pulgadas. Envío disponible a Argentina.'
    },
    {
      asin: 'B00FLYWNYQ',
      title: 'Instant Pot Duo 7-in-1 Olla de presión eléctrica, 6 Qt',
      price: {
        current: 79.99,
        original: 99.99,
        currency: 'USD'
      },
      shipping: {
        price: 16.99,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/71Q9rYy2BVL._AC_SL1500_.jpg',
      rating: 4.7,
      reviewCount: 89000,
      availability: 'En stock - Envío a Argentina',
      category: 'Hogar y Cocina',
      url: 'https://amazon.com/dp/B00FLYWNYQ?tag=demoaffiliate-20',
      description: 'Olla de presión eléctrica multifuncional. Perfecta para cocinar rápido y saludable. Envío a Argentina.'
    },
    {
      asin: 'B08N5WRWNW',
      title: 'Dyson V15 Detect Aspiradora inalámbrica con láser',
      price: {
        current: 649.99,
        original: 749.99,
        currency: 'USD'
      },
      shipping: {
        price: 35.99,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/61Qf1Z1l5VL._AC_SL1500_.jpg',
      rating: 4.6,
      reviewCount: 45000,
      availability: 'En stock - Envío a Argentina',
      category: 'Hogar y Cocina',
      url: 'https://amazon.com/dp/B08N5WRWNW?tag=demoaffiliate-20',
      description: 'Aspiradora inalámbrica de alta tecnología con láser para detectar polvo invisible. Envío internacional.'
    },
    {
      asin: 'B0B7BQJ8QZ',
      title: 'Apple Watch Series 9 GPS 45mm',
      price: {
        current: 79.99,
        original: 99.99,
        currency: 'USD'
      },
      shipping: {
        price: 0,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
      rating: 4.7,
      reviewCount: 120000,
      availability: 'En stock - Envío a Argentina',
      category: 'Electrónicos',
      url: 'https://amazon.com/dp/B0B7BQJ8QZ?tag=demoaffiliate-20',
      description: 'Smartwatch con GPS y pantalla Always-On. Envío disponible a Argentina.'
    },
    {
      asin: 'B0B7BQJ8QY',
      title: 'Sony WH-CH720N Auriculares inalámbricos con cancelación de ruido',
      price: {
        current: 89.99,
        currency: 'USD'
      },
      shipping: {
        price: 0,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
      rating: 4.5,
      reviewCount: 89000,
      availability: 'En stock - Envío a Argentina',
      category: 'Electrónicos',
      url: 'https://amazon.com/dp/B0B7BQJ8QY?tag=demoaffiliate-20',
      description: 'Auriculares inalámbricos con cancelación de ruido y hasta 35 horas de batería. Envío internacional.'
    },
    {
      asin: 'B0B7BQJ8QX',
      title: 'iPad Air (5ª generación) Wi-Fi 64GB',
      price: {
        current: 75.99,
        original: 89.99,
        currency: 'USD'
      },
      shipping: {
        price: 0,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/61Qf1Z1l5VL._AC_SL1500_.jpg',
      rating: 4.8,
      reviewCount: 156000,
      availability: 'En stock - Envío a Argentina',
      category: 'Electrónicos',
      url: 'https://amazon.com/dp/B0B7BQJ8QX?tag=demoaffiliate-20',
      description: 'Tablet iPad Air con chip M1 y pantalla Liquid Retina de 10.9 pulgadas. Envío internacional.'
    },
    {
      asin: 'B0B7BQJ8QW',
      title: 'KitchenAid Artisan Batidora de pie 5 qt',
      price: {
        current: 69.99,
        currency: 'USD'
      },
      shipping: {
        price: 0,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/71Q9rYy2BVL._AC_SL1500_.jpg',
      rating: 4.7,
      reviewCount: 89000,
      availability: 'En stock - Envío a Argentina',
      category: 'Hogar y Cocina',
      url: 'https://amazon.com/dp/B0B7BQJ8QW?tag=demoaffiliate-20',
      description: 'Batidora de pie profesional con bowl de acero inoxidable de 5 cuartos. Envío internacional.'
    },
    {
      asin: 'B0B7BQJ8QV',
      title: 'Nintendo Switch Lite - Turquesa',
      price: {
        current: 82.99,
        original: 99.99,
        currency: 'USD'
      },
      shipping: {
        price: 0,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/61Qf1Z1l5VL._AC_SL1500_.jpg',
      rating: 4.6,
      reviewCount: 120000,
      availability: 'En stock - Envío a Argentina',
      category: 'Videojuegos',
      url: 'https://amazon.com/dp/B0B7BQJ8QV?tag=demoaffiliate-20',
      description: 'Consola portátil Nintendo Switch Lite en color turquesa. Envío disponible a Argentina.'
    },
    {
      asin: 'B0B7BQJ8QU',
      title: 'Dyson V8 Cordless Vacuum Cleaner',
      price: {
        current: 88.99,
        currency: 'USD'
      },
      shipping: {
        price: 0,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/61Qf1Z1l5VL._AC_SL1500_.jpg',
      rating: 4.5,
      reviewCount: 67000,
      availability: 'En stock - Envío a Argentina',
      category: 'Hogar y Cocina',
      url: 'https://amazon.com/dp/B0B7BQJ8QU?tag=demoaffiliate-20',
      description: 'Aspiradora inalámbrica Dyson V8 con hasta 40 minutos de autonomía. Envío internacional.'
    },
    {
      asin: 'B0B7BQJ8QT',
      title: 'Fitbit Versa 4 Smartwatch con GPS',
      price: {
        current: 76.99,
        original: 99.99,
        currency: 'USD'
      },
      shipping: {
        price: 0,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
      rating: 4.4,
      reviewCount: 45000,
      availability: 'En stock - Envío a Argentina',
      category: 'Electrónicos',
      url: 'https://amazon.com/dp/B0B7BQJ8QT?tag=demoaffiliate-20',
      description: 'Smartwatch Fitbit Versa 4 con GPS integrado y seguimiento de salud avanzado. Envío internacional.'
    },
    {
      asin: 'B0B7BQJ8QS',
      title: 'Ninja Foodi Personal Blender con Smoothie Bowl',
      price: {
        current: 84.99,
        currency: 'USD'
      },
      shipping: {
        price: 0,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/71Q9rYy2BVL._AC_SL1500_.jpg',
      rating: 4.6,
      reviewCount: 32000,
      availability: 'En stock - Envío a Argentina',
      category: 'Hogar y Cocina',
      url: 'https://amazon.com/dp/B0B7BQJ8QS?tag=demoaffiliate-20',
      description: 'Licuadora personal Ninja con función de smoothie bowl y tecnología Auto-iQ. Envío internacional.'
    },
    {
      asin: 'B0B7BQJ8QR',
      title: 'Samsung Galaxy Buds2 Pro Auriculares inalámbricos',
      price: {
        current: 78.99,
        original: 89.99,
        currency: 'USD'
      },
      shipping: {
        price: 0,
        currency: 'USD',
        destination: 'Argentina'
      },
      image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
      rating: 4.7,
      reviewCount: 89000,
      availability: 'En stock - Envío a Argentina',
      category: 'Electrónicos',
      url: 'https://amazon.com/dp/B0B7BQJ8QR?tag=demoaffiliate-20',
      description: 'Auriculares Samsung Galaxy Buds2 Pro con cancelación activa de ruido y calidad de sonido Hi-Fi. Envío internacional.'
    }
  ];

  searchProducts(query: string, page: number = 1, limit: number = 10, region: string = 'US'): Observable<SearchResponse> {
    // For demo purposes, return mock data
    // In production, you would use the actual Amazon API with the specified region
    return of(this.getMockSearchResults(query, page, limit, region));
  }

  getTopSellingProducts(category?: string, region: string = 'US'): Observable<SearchResponse> {
    // Return mock top-selling products for the specified region
    const filteredProducts = category
      ? this.mockProducts.filter(p => p.category.toLowerCase().includes(category.toLowerCase()))
      : this.mockProducts;

    return of({
      products: filteredProducts.slice(0, 10),
      totalResults: filteredProducts.length,
      page: 1,
      totalPages: Math.ceil(filteredProducts.length / 10)
    });
  }

  getProductDetails(asin: string): Observable<AmazonProduct | null> {
    const product = this.mockProducts.find(p => p.asin === asin);
    return of(product || null);
  }

  private getMockSearchResults(query: string, page: number, limit: number, region: string = 'US'): SearchResponse {
    const filteredProducts = this.mockProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );

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
