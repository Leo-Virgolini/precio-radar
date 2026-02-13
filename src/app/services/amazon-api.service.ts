import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AmazonProduct, SearchResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AmazonApiService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.rainforestapi.com/request';
  private readonly apiKey = 'YOUR_API_KEY';

  // TODO: Reemplazar con tu tag real de Amazon Associates una vez aprobado
  private readonly affiliateTag = 'TU-TAG-AQUI';

  // Productos reales
  private readonly mockProducts: AmazonProduct[] = [
    {
      asin: 'B0DR9S2DQR',
      title: 'STANLEY Quencher ProTour Flip Straw Tumbler with Leakproof Lid | Built-In Straw & Handle | Cupholder Compatible for Travel | Insulated Stainless Steel Cup | BPA-Free',
      price: { current: 45.00, currency: 'USD' },
      shipping: { price: 24.23, currency: 'USD', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/614QBr7-g+L._AC_SL1500_.jpg',
      rating: 4.6,
      reviewCount: 12453,
      availability: 'En stock',
      category: 'Hogar y cocina',
      url: 'https://www.amazon.com/dp/B0DR9S2DQR?tag=' + this.affiliateTag,
      description: 'Vaso térmico Stanley con tapa a prueba de derrames, pajilla integrada y asa. Acero inoxidable aislado, libre de BPA.',
      region: 'US'
    },
    {
      asin: 'B0CYVVMKHC',
      title: 'STANLEY IceFlow Flip Straw 2.0 Water Bottle 36 OZ | Built-In Straw with Larger Opening | Lightweight & Leak-Resistant | Insulated Stainless Steel | BPA-Free | Ash',
      price: { current: 39.56, original: 45.00, currency: 'USD' },
      shipping: { price: 24.18, currency: 'USD', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/51I4kaZlEoL._AC_SL1500_.jpg',
      rating: 4.5,
      reviewCount: 8921,
      availability: 'En stock',
      category: 'Deportes y aire libre',
      url: 'https://www.amazon.com/dp/B0CYVVMKHC?tag=' + this.affiliateTag,
      description: 'Botella de agua Stanley IceFlow con pajilla integrada, liviana y resistente a derrames. Acero inoxidable aislado.',
      region: 'US'
    },
    {
      asin: 'B0FCBM6C3C',
      title: '[Compatible with Netflix & TOF Real-time Focus] Mini Projector with WiFi and Bluetooth, XuanPad Silver Smart Projector 4K Support, Dolby Audio & Keystone, 210° Rotatable Stand for Home',
      price: { current: 199.99, original: 289.99, currency: 'USD' },
      shipping: { price: 0, currency: 'USD', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/81db1C0gnOL._AC_SL1500_.jpg',
      rating: 4.3,
      reviewCount: 3567,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B0FCBM6C3C?tag=' + this.affiliateTag,
      description: 'Mini proyector XuanPad compatible con Netflix, WiFi y Bluetooth, soporte 4K, Dolby Audio y soporte rotable 210°.',
      region: 'US'
    },
    {
      asin: 'B0FWBHDFWK',
      title: 'Blackview DCM6 Triple Laptop Screen Extender, 14" 1080P FHD IPS Portable External Screen, Two Cable USB C Travel for 13-17" Laptop, Plug & Play Compatible with Windows/Mac/Chrome OS and Mobile Devices',
      price: { current: 249.99, original: 399.99, currency: 'USD' },
      shipping: { price: 0, currency: 'USD', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/715PcjJJMNL._AC_SL1500_.jpg',
      rating: 4.1,
      reviewCount: 1234,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B0FWBHDFWK?tag=' + this.affiliateTag,
      description: 'Extensor de pantalla triple Blackview para laptops 13-17", 14" FHD IPS, conexión USB-C, compatible con Windows/Mac/Chrome OS.',
      region: 'US'
    },
    {
      asin: 'B0DTBN55K9',
      title: 'Lenovo Legion Go S - 2025 - Mobile Gaming Console - AMD Radeon graphics - 8" PureSight IPS Display - 120Hz - AMD Ryzen Z2 Go - 16GB Memory - 512GB Storage - Glacier White - Free PC Game Pass',
      price: { current: 689.41, currency: 'USD' },
      shipping: { price: 0, currency: 'USD', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/71axrw7z6WL._AC_SL1500_.jpg',
      rating: 4.2,
      reviewCount: 2891,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B0DTBN55K9?tag=' + this.affiliateTag,
      description: 'Consola portátil gaming Lenovo Legion Go S 2025 con pantalla 8" 120Hz, AMD Ryzen Z2 Go, 16GB RAM y 512GB SSD.',
      region: 'US'
    },
    {
      asin: 'B0F5KTGDS9',
      title: 'acer Nitro V Gaming Laptop | Intel Core i5-13420H Processor | NVIDIA GeForce RTX 4050 Laptop GPU | 15.6" FHD IPS 165Hz Display | 8GB DDR5 | 512GB Gen 4 SSD | Wi-Fi 6 | Backlit KB | ANV15-52-586Z',
      price: { current: 649.99, original: 749.99, currency: 'USD' },
      shipping: { price: 0, currency: 'USD', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/71gXelI8upL._AC_SL1500_.jpg',
      rating: 4.4,
      reviewCount: 5678,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B0F5KTGDS9?tag=' + this.affiliateTag,
      description: 'Laptop gaming Acer Nitro V con Intel Core i5, RTX 4050, pantalla 15.6" FHD 165Hz, 8GB DDR5 y 512GB SSD.',
      region: 'US'
    },
    {
      asin: 'B0FDLX4F6T',
      title: 'GIGABYTE AERO X16, Copilot+ PC - 165Hz 2560x1600 WQXGA - Manufactured by NVIDIA GeForce RTX 5070 - AMD Ryzen AI 9 HX 370-1TB SSD with 32GB DDR5 RAM - Windows 11 Home - Space Gray - 2WHA3USC64AH',
      price: { current: 1688.07, currency: 'USD' },
      shipping: { price: 0, currency: 'USD', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/61Dup4mtSKL._AC_SL1500_.jpg',
      rating: 4.0,
      reviewCount: 456,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B0FDLX4F6T?tag=' + this.affiliateTag,
      description: 'Laptop GIGABYTE AERO X16 Copilot+ con RTX 5070, AMD Ryzen AI 9 HX 370, 32GB DDR5, 1TB SSD y pantalla WQXGA 165Hz.',
      region: 'US'
    },
    {
      asin: 'B0DSW7R4VN',
      title: 'WOLFBOX MF50 Compressed Air Duster-110000RPM Super Power Electric Air Duster, 3-Gear Adjustable Mini Blower with Fast Charging, Dust Blower for Computer, Keyboard, House, Outdoor and Car',
      price: { current: 31.99, original: 39.99, currency: 'USD' },
      shipping: { price: 21.34, currency: 'USD', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/713BEhBxXWL._AC_SL1500_.jpg',
      rating: 4.7,
      reviewCount: 15234,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B0DSW7R4VN?tag=' + this.affiliateTag,
      description: 'Soplador de aire comprimido eléctrico WOLFBOX 110000RPM, 3 velocidades, carga rápida. Para computadoras, teclados y más.',
      region: 'US'
    },
    {
      asin: 'B08SGM6F79',
      title: 'STREBITO Electronics Precision Screwdriver Sets 142-Piece with 120 Bits Magnetic Repair Tool Kit for iPhone, MacBook, Computer, Laptop, PC, Tablet, PS4, Xbox, Nintendo, Game Console',
      price: { current: 27.99, original: 37.99, currency: 'USD' },
      shipping: { price: 23.24, currency: 'USD', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/81HGJ-wOEzL._AC_SL1500_.jpg',
      rating: 4.8,
      reviewCount: 42567,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B08SGM6F79?tag=' + this.affiliateTag,
      description: 'Kit de destornilladores de precisión STREBITO 142 piezas con 120 puntas magnéticas para reparación de electrónicos.',
      region: 'US'
    },
    {
      asin: 'B07T6FNLQV',
      title: 'LC-dolida Sleep Headphones, 3D Sleep Mask Bluetooth Wireless Music Eye Mask, Sleeping Headphones for Side Sleepers Sleep Mask with Bluetooth Headphones Ultra-Thin Stereo Speakers Perfect for Sleeping',
      price: { current: 29.99, original: 39.99, currency: 'USD' },
      shipping: { price: 21.66, currency: 'USD', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/71GGksIzY-L._AC_SL1500_.jpg',
      rating: 4.3,
      reviewCount: 28901,
      availability: 'En stock',
      category: 'Salud y cuidado personal',
      url: 'https://www.amazon.com/dp/B07T6FNLQV?tag=' + this.affiliateTag,
      description: 'Antifaz para dormir con auriculares Bluetooth integrados, altavoces ultra delgados, ideal para dormir de costado.',
      region: 'US'
    },
    {
      asin: 'B0BVM4WKJK',
      title: 'BAMBOO COOL Men\'s Ultra ComfortSoft Underwear, Moisture Wicking & Breathable No Ride Up Boxer Briefs with Fly, Multipack',
      price: { current: 48.52, original: 60.66, currency: 'USD' },
      shipping: { price: 23.38, currency: 'USD', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/61ISlxsowlL._AC_SX679_.jpg',
      rating: 4.5,
      reviewCount: 9876,
      availability: 'En stock',
      category: 'Moda',
      url: 'https://www.amazon.com/dp/B0BVM4WKJK?tag=' + this.affiliateTag,
      description: 'Boxers de bambú BAMBOO COOL para hombre, transpirables, absorción de humedad, multipack.',
      region: 'US'
    }
  ];

  // Productos de Amazon España
  private readonly mockProductsES: AmazonProduct[] = [
    {
      asin: 'B0DGHWMFQ3',
      title: 'Samsung Galaxy S24 FE 5G, Smartphone Android, 128 GB, 8 GB RAM, Batería 4.700 mAh, Cámara 50 MP, Pantalla Dynamic AMOLED 2X 6.7", Blue',
      price: { current: 549.00, original: 749.00, currency: 'EUR' },
      shipping: { price: 23.20, currency: 'EUR', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/61LnUTvbruL._AC_SL1500_.jpg',
      rating: 4.4,
      reviewCount: 6789,
      availability: 'En stock - Envío internacional disponible',
      category: 'Electrónicos',
      url: 'https://www.amazon.es/dp/B0DGHWMFQ3?tag=' + this.affiliateTag,
      description: 'Samsung Galaxy S24 FE 5G con pantalla Dynamic AMOLED 2X de 6.7", cámara de 50MP, 128GB y batería de 4700mAh.',
      region: 'ES'
    },
    {
      asin: 'B0D1XC876S',
      title: 'Apple iPad (10ª generación): con chip A14 Bionic, pantalla Liquid Retina de 10,9 pulgadas, 64 GB, Wi-Fi 6, cámara frontal de 12 Mpx/cámara trasera de 12 Mpx, Touch ID, Azul',
      price: { current: 349.00, original: 399.00, currency: 'EUR' },
      shipping: { price: 26.50, currency: 'EUR', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/61NGnpjoRDL._AC_SL1500_.jpg',
      rating: 4.7,
      reviewCount: 34567,
      availability: 'En stock - Envío internacional disponible',
      category: 'Electrónicos',
      url: 'https://www.amazon.es/dp/B0D1XC876S?tag=' + this.affiliateTag,
      description: 'iPad 10ª generación con chip A14 Bionic, pantalla Liquid Retina 10.9", 64GB Wi-Fi, Touch ID.',
      region: 'ES'
    },
    {
      asin: 'B0CHX3QBCH',
      title: 'JBL Tune 520BT – Auriculares inalámbricos on-ear con tecnología JBL Pure Bass – Conexión multipunto y Bluetooth 5.3 – 57 h de batería – Azul',
      price: { current: 34.99, original: 59.99, currency: 'EUR' },
      shipping: { price: 23.20, currency: 'EUR', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/61SUkFGVURL._AC_SL1500_.jpg',
      rating: 4.5,
      reviewCount: 18234,
      availability: 'En stock - Envío internacional disponible',
      category: 'Electrónicos',
      url: 'https://www.amazon.es/dp/B0CHX3QBCH?tag=' + this.affiliateTag,
      description: 'Auriculares inalámbricos JBL Tune 520BT con JBL Pure Bass, Bluetooth 5.3 y 57 horas de batería.',
      region: 'ES'
    },
    {
      asin: 'B0BN72D63F',
      title: 'Logitech G502 X PLUS Ratón Gaming Inalámbrico con tecnología LIGHTFORCE, LIGHTSPEED, HERO 25K, Botones Óptico-Mecánicos, RGB, Lightforcing, Negro',
      price: { current: 99.99, original: 169.99, currency: 'EUR' },
      shipping: { price: 23.20, currency: 'EUR', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg',
      rating: 4.6,
      reviewCount: 11234,
      availability: 'En stock - Envío internacional disponible',
      category: 'Electrónicos',
      url: 'https://www.amazon.es/dp/B0BN72D63F?tag=' + this.affiliateTag,
      description: 'Ratón gaming Logitech G502 X PLUS inalámbrico con sensor HERO 25K, LIGHTSPEED, RGB y botones óptico-mecánicos.',
      region: 'ES'
    },
    {
      asin: 'B09V3KXJPB',
      title: 'Kindle Paperwhite (16 GB) – Ahora con una pantalla de 6,8" y luz cálida ajustable – Con publicidad',
      price: { current: 154.99, original: 169.99, currency: 'EUR' },
      shipping: { price: 23.20, currency: 'EUR', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/61iS6kIGP+L._AC_SL1000_.jpg',
      rating: 4.7,
      reviewCount: 89012,
      availability: 'En stock - Envío internacional disponible',
      category: 'Electrónicos',
      url: 'https://www.amazon.es/dp/B09V3KXJPB?tag=' + this.affiliateTag,
      description: 'Kindle Paperwhite con pantalla de 6.8", luz cálida ajustable, 16GB de almacenamiento.',
      region: 'ES'
    },
    {
      asin: 'B0DFDJQH5V',
      title: 'Cecotec Robot Aspirador Conga 8290 Ultra Home Genesis. 10000 Pa, Tecnología Láser, Room Plan 4.0, MagneticStrip, App, Cepillo Jalisco, Mascotas, Mopa, Compatible con Alexa y Google Home',
      price: { current: 249.00, original: 399.00, currency: 'EUR' },
      shipping: { price: 54.00, currency: 'EUR', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/61pOVkjrVwL._AC_SL1500_.jpg',
      rating: 4.2,
      reviewCount: 3456,
      availability: 'En stock - Envío internacional disponible',
      category: 'Hogar y cocina',
      url: 'https://www.amazon.es/dp/B0DFDJQH5V?tag=' + this.affiliateTag,
      description: 'Robot aspirador Cecotec Conga 8290 con tecnología láser, 10000 Pa de succión, compatible con Alexa y Google Home.',
      region: 'ES'
    },
    {
      asin: 'B08C4KWM9T',
      title: 'Garmin Instinct 2 Solar – Reloj GPS resistente para exteriores con carga solar, más de 24 días de batería, múltiples sistemas GNSS, Frecuencia cardíaca, Grafito',
      price: { current: 269.99, original: 399.99, currency: 'EUR' },
      shipping: { price: 23.20, currency: 'EUR', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/61pxXgY07BL._AC_SL1500_.jpg',
      rating: 4.5,
      reviewCount: 21345,
      availability: 'En stock - Envío internacional disponible',
      category: 'Deportes y aire libre',
      url: 'https://www.amazon.es/dp/B08C4KWM9T?tag=' + this.affiliateTag,
      description: 'Reloj GPS Garmin Instinct 2 Solar con carga solar, más de 24 días de batería y frecuencia cardíaca.',
      region: 'ES'
    },
    {
      asin: 'B0BSHF7WHY',
      title: 'Xiaomi Redmi Watch 4 - Reloj inteligente con pantalla AMOLED de 1,97", GPS, 150+ modos de deporte, frecuencia cardíaca, SpO2, resistencia al agua 5 ATM, Negro',
      price: { current: 79.99, original: 99.99, currency: 'EUR' },
      shipping: { price: 23.20, currency: 'EUR', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/51FWbV9OKVL._AC_SL1024_.jpg',
      rating: 4.3,
      reviewCount: 7890,
      availability: 'En stock - Envío internacional disponible',
      category: 'Electrónicos',
      url: 'https://www.amazon.es/dp/B0BSHF7WHY?tag=' + this.affiliateTag,
      description: 'Reloj inteligente Xiaomi Redmi Watch 4 con pantalla AMOLED 1.97", GPS, 150+ modos de deporte y resistencia al agua 5ATM.',
      region: 'ES'
    },
    {
      asin: 'B0C5GGN97C',
      title: 'LEGO Technic McLaren F1 Race Car 2024, Maqueta para Construir de Coche de Carreras, Set de Construcción de Vehículo con Motor V6, Regalo para Niños',
      price: { current: 22.49, original: 29.99, currency: 'EUR' },
      shipping: { price: 23.20, currency: 'EUR', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/81Ow7LT1fuL._AC_SL1500_.jpg',
      rating: 4.8,
      reviewCount: 5432,
      availability: 'En stock - Envío internacional disponible',
      category: 'Juguetes y juegos',
      url: 'https://www.amazon.es/dp/B0C5GGN97C?tag=' + this.affiliateTag,
      description: 'LEGO Technic McLaren F1 2024, maqueta de coche de carreras con motor V6, set de construcción.',
      region: 'ES'
    },
    {
      asin: 'B0CXLM3F4R',
      title: 'Isdin Fotoprotector Fusion Water SPF 50 – Protector Solar Facial de Fase Acuosa para Uso Diario, 50ml',
      price: { current: 18.90, original: 24.50, currency: 'EUR' },
      shipping: { price: 22.10, currency: 'EUR', destination: 'Argentina' },
      image: 'https://m.media-amazon.com/images/I/51Ke-K+6R0L._AC_SL1500_.jpg',
      rating: 4.6,
      reviewCount: 14567,
      availability: 'En stock - Envío internacional disponible',
      category: 'Salud y cuidado personal',
      url: 'https://www.amazon.es/dp/B0CXLM3F4R?tag=' + this.affiliateTag,
      description: 'Protector solar facial Isdin Fusion Water SPF 50, fase acuosa para uso diario, 50ml.',
      region: 'ES'
    }
  ];

  private getProductsByRegion(region: string): AmazonProduct[] {
    if (region === 'ALL') {
      return [...this.mockProducts, ...this.mockProductsES];
    }
    return region === 'ES' ? this.mockProductsES : this.mockProducts;
  }

  searchProducts(query: string, page: number = 1, limit: number = 10, region: string = 'US', category?: string): Observable<SearchResponse> {
    return of(this.getMockSearchResults(query, page, limit, region, category));
  }

  getTopSellingProducts(category?: string, region: string = 'US'): Observable<SearchResponse> {
    const regionProducts = this.getProductsByRegion(region);
    const filteredProducts = category
      ? regionProducts.filter(p => p.category.toLowerCase().includes(category.toLowerCase()))
      : regionProducts;

    return of({
      products: filteredProducts,
      totalResults: filteredProducts.length,
      page: 1,
      totalPages: Math.ceil(filteredProducts.length / 10)
    });
  }

  getProductDetails(asin: string): Observable<AmazonProduct | null> {
    const allProducts = [...this.mockProducts, ...this.mockProductsES];
    const product = allProducts.find(p => p.asin === asin);
    return of(product || null);
  }

  getProductsByAsins(items: { asin: string; region: string }[]): Observable<AmazonProduct[]> {
    const allProducts = [...this.mockProducts, ...this.mockProductsES];
    const found = items
      .map(item => allProducts.find(p => p.asin === item.asin))
      .filter((p): p is AmazonProduct => p !== undefined);
    return of(found);
  }

  private getMockSearchResults(query: string, page: number, limit: number, region: string = 'US', category?: string): SearchResponse {
    const regionProducts = this.getProductsByRegion(region);
    let filteredProducts = regionProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
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
