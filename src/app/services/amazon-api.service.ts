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
      title: 'STANLEY Quencher ProTour - Vaso de paja con tapa a prueba de fugas, popote y asa integrados, compatible con portavasos para viajes, vaso de acero inoxidable aislado sin BPA',
      price: { current: 45.00, currency: 'USD' },
      shipping: { price: 24.23, currency: 'USD', destination: 'Argentina', freeAbove99: true },
      images: ['https://m.media-amazon.com/images/I/614QBr7-g+L._AC_SL1500_.jpg'],
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
      title: 'STANLEY IceFlow - Botella de agua con pajilla abatible 2.0 de 36 onzas, popote integrado con apertura más grande, ligera y resistente a fugas, acero inoxidable aislado, sin BPA, color ceniza',
      price: { current: 39.56, original: 45.00, currency: 'USD' },
      shipping: { price: 24.18, currency: 'USD', destination: 'Argentina', freeAbove99: true },
      images: ['https://m.media-amazon.com/images/I/51I4kaZlEoL._AC_SL1500_.jpg'],
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
      title: 'Mini Proyector Compatible con Netflix y Enfoque en Tiempo Real TOF con WiFi y Bluetooth, Proyector Inteligente XuanPad con Soporte 4K, Audio Dolby y Keystone, Soporte Giratoria de 210° para el Hogar',
      price: { current: 199.99, original: 289.99, currency: 'USD' },
      shipping: { price: 0, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/81db1C0gnOL._AC_SL1500_.jpg'],
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
      title: 'Blackview DCM6 - Extensor de pantalla triple para laptop, pantalla externa portátil 1080P FHD IPS de 14 pulgadas, dos cables USB C de viaje para laptop de 13 a 17 pulgadas, compatible con Windows/Mac',
      price: { current: 249.99, original: 399.99, currency: 'USD' },
      shipping: { price: 0, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/715PcjJJMNL._AC_SL1500_.jpg'],
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
      title: 'Lenovo Legion Go S - 2025 - Consola de juegos móvil - Gráficos AMD Radeon - Pantalla IPS PureSight de 8" - 120Hz - AMD Ryzen™ Z2 Go - Memoria de 16GB - Almacenamiento de 512GB - Blanco glaciar - PC',
      price: { current: 689.41, currency: 'USD' },
      shipping: { price: 0, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/71axrw7z6WL._AC_SL1500_.jpg'],
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
      title: 'Acer - Laptop Nitro V para juegos, procesador Intel Core i5-13420H, GPU NVIDIA GeForce RTX 4050, FHD IPS, 15.6 pulgadas, 165 Hz, 8 GB DDR5, SSD 512 GB Gen 4, Wi-Fi 6, KB retroiluminado, ANV15-52-586Z',
      price: { current: 649.99, original: 749.99, currency: 'USD' },
      shipping: { price: 0, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/71gXelI8upL._AC_SL1500_.jpg'],
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
      title: 'GIGABYTE AERO X16, Copilot+ PC - 165Hz 2560x1600 WQXGA - Fabricado por NVIDIA GeForce RTX 5070 - AMD Ryzen AI 9 HX 370-1TB SSD con 32GB DDR5 RAM - Windows 11 Home - Gris espacial - 2WHA3USC64AH',
      price: { current: 1688.07, currency: 'USD' },
      shipping: { price: 0, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/61Dup4mtSKL._AC_SL1500_.jpg'],
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
      title: 'WOLFBOX MF50 Plumero de aire comprimido - Soplador eléctrico de aire de 110000RPM Super Power, soplador mini ajustable de 3 velocidades con carga rápida, soplador de polvo para computadora, teclado',
      price: { current: 31.99, original: 39.99, currency: 'USD' },
      shipping: { price: 21.34, currency: 'USD', destination: 'Argentina', freeAbove99: true },
      images: ['https://m.media-amazon.com/images/I/713BEhBxXWL._AC_SL1500_.jpg'],
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
      title: 'STREBITO - Juego de destornilladores de precisión de 142 piezas con kit de herramientas de reparación magnética de 120 puntas para iPhone, MacBook, computadora, laptop, PC, tableta, PS4, Xbox, Nintendo, consola de juegos',
      price: { current: 27.99, original: 37.99, currency: 'USD' },
      shipping: { price: 23.24, currency: 'USD', destination: 'Argentina', freeAbove99: true },
      images: ['https://m.media-amazon.com/images/I/81HGJ-wOEzL._AC_SL1500_.jpg'],
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
      title: 'LC-dolida - Auriculares para dormir, Máscara de ojos 3D con Bluetooth, música inalámbrica, máscara para dormir con auriculares Bluetooth, altavoces estéreo ultrafinos perfectos para dormir; ideal para',
      price: { current: 29.99, original: 39.99, currency: 'USD' },
      shipping: { price: 21.66, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/71GGksIzY-L._AC_SL1500_.jpg'],
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
      title: 'BAMBOO COOL Calzoncillos tipo bóxer ultra ComfortSoft para hombre, absorben la humedad y son transpirables, no se suben con bragueta, paquete múltiple',
      price: { current: 48.52, original: 60.66, currency: 'USD' },
      shipping: { price: 23.38, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/61ISlxsowlL._AC_SX679_.jpg'],
      rating: 4.5,
      reviewCount: 9876,
      availability: 'En stock',
      category: 'Moda',
      url: 'https://www.amazon.com/dp/B0BVM4WKJK?tag=' + this.affiliateTag,
      description: 'Boxers de bambú BAMBOO COOL para hombre, transpirables, absorción de humedad, multipack.',
      region: 'US'
    },
    {
      asin: 'B07FPQZG6V',
      title: 'Gorilla Grip - Tapete de baño de felpilla gruesa, suave y absorbente, secado rápido, de microfibra, con reverso de caucho, para piso de ducha, accesorios de decoración, 24 x 17 pulgadas, color gris',
      price: { current: 9.39, original: 15.99, currency: 'USD' },
      shipping: { price: 22.16, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/71y11KMV2kL._AC_SL1000_.jpg'],
      rating: 4.3,
      reviewCount: 79502,
      availability: 'En stock',
      category: 'Hogar y cocina',
      url: 'https://www.amazon.com/dp/B07FPQZG6V?tag=' + this.affiliateTag,
      description: 'Tapete de baño Gorilla Grip de felpilla gruesa con reverso de caucho antideslizante, secado rápido, microfibra suave.',
      region: 'US'
    },
    {
      asin: 'B0BDF8CVBN',
      title: 'Iluminación bajo gabinete de 10 pulgadas, paquete de 2 luces recargables con sensor de movimiento para interiores, 5 niveles regulables, luces magnéticas para armario',
      price: { current: 26.99, currency: 'USD' },
      shipping: { price: 21.26, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/61x62WLGvNL._AC_SL1500_.jpg'],
      rating: 4.5,
      reviewCount: 49986,
      availability: 'En stock',
      category: 'Herramientas y mejoras del hogar',
      url: 'https://www.amazon.com/dp/B0BDF8CVBN?tag=' + this.affiliateTag,
      description: 'Luces LED bajo gabinete con sensor de movimiento, recargables, 5 niveles de brillo, magnéticas para armarios.',
      region: 'US'
    },
    {
      asin: 'B07VX6GH88',
      title: 'Yimobra Tapete de baño de espuma viscoelástica, súper suave, absorbente, antideslizante, de secado rápido, lavable a máquina, tapete para bañera y ducha, 24 x 17',
      price: { current: 9.99, original: 14.99, currency: 'USD' },
      shipping: { price: 32.02, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/91iieFSQ0QL._AC_SL1500_.jpg'],
      rating: 4.5,
      reviewCount: 53871,
      availability: 'En stock',
      category: 'Hogar y cocina',
      url: 'https://www.amazon.com/dp/B07VX6GH88?tag=' + this.affiliateTag,
      description: 'Tapete de baño Yimobra de espuma viscoelástica, antideslizante, lavable a máquina, secado rápido.',
      region: 'US'
    },
    {
      asin: 'B083FBRJPM',
      title: 'Saker Herramienta para medir y duplicar contornos, bloqueo a 10 pulgadas, ajustable y precisa, ideal para duplicar formas irregulares en trabajos de construcción, carpintería y trazado',
      price: { current: 29.99, currency: 'USD' },
      shipping: { price: 21.52, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/61yJmyPOHKL._AC_SL1000_.jpg'],
      rating: 4.6,
      reviewCount: 27086,
      availability: 'En stock',
      category: 'Herramientas y mejoras del hogar',
      url: 'https://www.amazon.com/dp/B083FBRJPM?tag=' + this.affiliateTag,
      description: 'Herramienta Saker para medir y duplicar contornos, ajustable y precisa, para carpintería y construcción.',
      region: 'US'
    },
    {
      asin: 'B09GTRVJQM',
      title: 'LEVOIT Purificadores de aire para dormitorio, hogar, verificado por AHAM, filtro 3 en 1 con esponja de fragancia, filtros portátiles para humo, alérgenos, caspa de mascotas, olor, polvo',
      price: { current: 39.99, original: 49.99, currency: 'USD' },
      shipping: { price: 30.09, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/71wGv7Fh2AL._AC_SL1500_.jpg'],
      rating: 4.6,
      reviewCount: 137371,
      availability: 'En stock',
      category: 'Hogar y cocina',
      url: 'https://www.amazon.com/dp/B09GTRVJQM?tag=' + this.affiliateTag,
      description: 'Purificador de aire LEVOIT con filtro 3 en 1, verificado por AHAM, portátil para humo, alérgenos y olores.',
      region: 'US'
    },
    {
      asin: 'B0BZZDPPRX',
      title: 'Escobilla de ducha multiusos de acero inoxidable para puerta de vidrio de ducha con 2 ganchos adhesivos, herramienta de limpieza de baño y ventanas',
      price: { current: 9.49, original: 13.98, currency: 'USD' },
      shipping: { price: 21.05, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/5102UAfkhjL._AC_SL1500_.jpg'],
      rating: 4.6,
      reviewCount: 15755,
      availability: 'En stock',
      category: 'Hogar y cocina',
      url: 'https://www.amazon.com/dp/B0BZZDPPRX?tag=' + this.affiliateTag,
      description: 'Escobilla de ducha de acero inoxidable con 2 ganchos adhesivos, para vidrio de ducha, espejos y ventanas.',
      region: 'US'
    },
    {
      asin: 'B085TFF7M1',
      title: 'Logitech Cámara web C920x HD Pro para PC, video Full HD 1080p/30fps, audio claro, corrección de luz HD, funciona con Microsoft Teams, Google Meet, Zoom',
      price: { current: 65.50, original: 69.99, currency: 'USD' },
      shipping: { price: 20.72, currency: 'USD', destination: 'Argentina', freeAbove99: true },
      images: ['https://m.media-amazon.com/images/I/71YN85pLGcL._AC_SL1500_.jpg'],
      rating: 4.6,
      reviewCount: 38400,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B085TFF7M1?tag=' + this.affiliateTag,
      description: 'Cámara web Logitech C920x HD Pro, Full HD 1080p, corrección de luz automática, compatible con Teams, Meet y Zoom.',
      region: 'US'
    },
    {
      asin: 'B015NBTAOW',
      title: 'Mouse óptico ergonómico TeckNet Pro 2.4 G con nanorecibidor USB para portátil, ordenador, Chromebook, Macbook, 6 botones, batería de 24 meses, 5 niveles de DPI',
      price: { current: 9.98, original: 15.99, currency: 'USD' },
      shipping: { price: 20.24, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/71tqvuHgIlL._AC_SL1500_.jpg'],
      rating: 4.5,
      reviewCount: 76003,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B015NBTAOW?tag=' + this.affiliateTag,
      description: 'Mouse inalámbrico TeckNet Pro ergonómico, 2.4 GHz, 6 botones, batería de 24 meses, 5 niveles de DPI.',
      region: 'US'
    },
    {
      asin: 'B0947BJ67M',
      title: 'HP 14 portátil, Intel Celeron N4020, 4 GB de RAM, 64 GB de almacenamiento, pantalla Micro-edge HD de 14 pulgadas, Windows 11 Home, un año de Microsoft 365 (14-dq0040nr)',
      price: { current: 172.89, original: 229.99, currency: 'USD' },
      shipping: { price: 28.54, currency: 'USD', destination: 'Argentina', freeAbove99: true },
      images: ['https://m.media-amazon.com/images/I/815uX7wkOZS._AC_SL1500_.jpg'],
      rating: 4.1,
      reviewCount: 5030,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B0947BJ67M?tag=' + this.affiliateTag,
      description: 'Laptop HP 14 con Intel Celeron N4020, 4GB RAM, 64GB almacenamiento, pantalla HD 14", Windows 11 y Microsoft 365.',
      region: 'US'
    },
    {
      asin: 'B09V366BDY',
      title: 'KSIPZE Tira de luces LED RGB de 100 pies, sincronización de música, luces LED que cambian de color con control de aplicación inteligente y control remoto, para dormitorio',
      price: { current: 9.99, original: 13.89, currency: 'USD' },
      shipping: { price: 21.12, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/71lntIT6FfL._AC_SL1500_.jpg'],
      rating: 4.4,
      reviewCount: 36101,
      availability: 'En stock',
      category: 'Herramientas y mejoras del hogar',
      url: 'https://www.amazon.com/dp/B09V366BDY?tag=' + this.affiliateTag,
      description: 'Tira de luces LED RGB de 100 pies con sincronización de música, control por app y control remoto.',
      region: 'US'
    },
    {
      asin: 'B01CS31R94',
      title: 'NICETOWN - Cortinas opacas con aislamiento térmico y ojales sólidos, para ventana de dormitorio (color negro, 2 paneles, 42 x 63 pulgadas)',
      price: { current: 31.53, currency: 'USD' },
      shipping: { price: 25.83, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/61Xsz1yLEML._AC_SL1500_.jpg'],
      rating: 4.6,
      reviewCount: 128023,
      availability: 'En stock',
      category: 'Hogar y cocina',
      url: 'https://www.amazon.com/dp/B01CS31R94?tag=' + this.affiliateTag,
      description: 'Cortinas opacas NICETOWN con aislamiento térmico, ojales sólidos, 2 paneles, ideales para dormitorio.',
      region: 'US'
    },
    {
      asin: 'B09F2J4SX1',
      title: 'HUONUL - Espejo para maquillaje con luces LED, aumento de x1, x2 y x3, iluminado, control táctil, espejo triple plegable, portátil, regalo para mujer',
      price: { current: 30.99, original: 37.99, currency: 'USD' },
      shipping: { price: 23.54, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/71kiuY9-5+L._SL1500_.jpg'],
      rating: 4.4,
      reviewCount: 21411,
      availability: 'En stock',
      category: 'Belleza y cuidado personal',
      url: 'https://www.amazon.com/dp/B09F2J4SX1?tag=' + this.affiliateTag,
      description: 'Espejo de maquillaje HUONUL con luces LED, triple aumento, control táctil, plegable y portátil.',
      region: 'US'
    },
    {
      asin: 'B099WTN2TR',
      title: 'Govee RGBIC Lámpara de Pie Básica, Lámpara de Esquina LED Funciona con Alexa, Inteligente de 1000 Lúmenes con Sincronización de Música y 16 Millones de Colores DIY',
      price: { current: 64.99, original: 99.99, currency: 'USD' },
      shipping: { price: 28.35, currency: 'USD', destination: 'Argentina', freeAbove99: true },
      images: ['https://m.media-amazon.com/images/I/61x63INkDgL._AC_SL1500_.jpg'],
      rating: 4.5,
      reviewCount: 10114,
      availability: 'En stock',
      category: 'Herramientas y mejoras del hogar',
      url: 'https://www.amazon.com/dp/B099WTN2TR?tag=' + this.affiliateTag,
      description: 'Lámpara de pie Govee RGBIC con Alexa, 1000 lúmenes, sincronización de música, 16 millones de colores.',
      region: 'US'
    },
    {
      asin: 'B0B4518KC2',
      title: 'Proyector de Luz Aurora de Galaxia del Norte con 33 Efectos de Luz, Proyector de Estrellas LED para Lámpara de Nebulosa de Dormitorio, Control Remoto, Altavoz Bluetooth para Fiestas',
      price: { current: 35.99, original: 41.99, currency: 'USD' },
      shipping: { price: 21.96, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/81ASRJlhl3L._AC_SL1500_.jpg'],
      rating: 4.5,
      reviewCount: 8782,
      availability: 'En stock',
      category: 'Herramientas y mejoras del hogar',
      url: 'https://www.amazon.com/dp/B0B4518KC2?tag=' + this.affiliateTag,
      description: 'Proyector de luz aurora y estrellas con 33 efectos, control remoto, ruidos blancos y altavoz Bluetooth.',
      region: 'US'
    },
    {
      asin: 'B0881QG5WK',
      title: 'ChrisDowa - Cortinas blackout con ojales para habitación y sala, juego de 2 paneles con aislamiento térmico, gris oscuro, 42 x 63 pulgadas',
      price: { current: 11.99, original: 18.48, currency: 'USD' },
      shipping: { price: 24.03, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/61b7ejuX+bS._AC_SL1500_.jpg'],
      rating: 4.6,
      reviewCount: 27358,
      availability: 'En stock',
      category: 'Hogar y cocina',
      url: 'https://www.amazon.com/dp/B0881QG5WK?tag=' + this.affiliateTag,
      description: 'Cortinas blackout ChrisDowa con ojales, aislamiento térmico, 2 paneles gris oscuro, 42 x 63 pulgadas.',
      region: 'US'
    },
    {
      asin: 'B0DMNDCNNJ',
      title: 'JOREST Juego de 59 destornilladores de precisión pequeños con Torx T5, T6, T8, mini kit de herramientas de reparación para Macbook, computadora, laptop, iPhone, PS4 PS5, Xbox, Switch',
      price: { current: 12.99, original: 13.99, currency: 'USD' },
      shipping: { price: 20.94, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/81EUU5sjsOL._AC_SL1500_.jpg'],
      rating: 4.6,
      reviewCount: 56420,
      availability: 'En stock',
      category: 'Herramientas y mejoras del hogar',
      url: 'https://www.amazon.com/dp/B0DMNDCNNJ?tag=' + this.affiliateTag,
      description: 'Kit de 59 destornilladores de precisión JOREST con Torx T5/T6/T8, para reparación de electrónicos y dispositivos.',
      region: 'US'
    },
    {
      asin: 'B072YVWBXH',
      title: 'Cepillo de dientes AquaSonic Black Series, ultrablanqueador, 8 cabezales DuPont, funda de viaje, motor ultrasónico de 40.000 VPM, carga inalámbrica, 4 modos con temporizador inteligente',
      price: { current: 29.95, original: 49.95, currency: 'USD' },
      shipping: { price: 21.56, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/71sZ7M1OHwL._AC_SL1500_.jpg'],
      rating: 4.5,
      reviewCount: 132124,
      availability: 'En stock',
      category: 'Salud y cuidado personal',
      url: 'https://www.amazon.com/dp/B072YVWBXH?tag=' + this.affiliateTag,
      description: 'Cepillo eléctrico AquaSonic Black Series con 8 cabezales, motor ultrasónico 40.000 VPM, carga inalámbrica.',
      region: 'US'
    },
    {
      asin: 'B083SH697H',
      title: 'FRAMEO - Marco de fotos digital inteligente WiFi de 10.1 pulgadas, pantalla táctil LCD IPS de 1280 x 800, rotación automática, memoria integrada de 32 GB',
      price: { current: 59.98, original: 69.98, currency: 'USD' },
      shipping: { price: 22.93, currency: 'USD', destination: 'Argentina', freeAbove99: true },
      images: ['https://m.media-amazon.com/images/I/71v8cZ36vwL._AC_SL1500_.jpg'],
      rating: 4.5,
      reviewCount: 11316,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B083SH697H?tag=' + this.affiliateTag,
      description: 'Marco de fotos digital FRAMEO WiFi, pantalla táctil IPS 10.1", 32GB, rotación automática, comparte momentos al instante.',
      region: 'US'
    },
    {
      asin: 'B07C2Z21X5',
      title: 'Canon EOS Rebel T7 Cámara DSLR con lente de 18-55mm | Wi-Fi integrado | Sensor CMOS de 24.1 MP | Procesador de imagen DIGIC 4+ y videos Full HD',
      price: { current: 579.00, currency: 'USD' },
      shipping: { price: 0, currency: 'USD', destination: 'Argentina' },
      images: ['https://m.media-amazon.com/images/I/714hINuPoBL._AC_SX466_.jpg'],
      rating: 4.6,
      reviewCount: 8349,
      availability: 'En stock',
      category: 'Electrónicos',
      url: 'https://www.amazon.com/dp/B07C2Z21X5?tag=' + this.affiliateTag,
      description: 'Cámara DSLR Canon EOS Rebel T7 con lente 18-55mm, Wi-Fi integrado, sensor CMOS 24.1 MP, procesador DIGIC 4+ y grabación Full HD.',
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
      images: ['https://m.media-amazon.com/images/I/61LnUTvbruL._AC_SL1500_.jpg'],
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
      images: ['https://m.media-amazon.com/images/I/61NGnpjoRDL._AC_SL1500_.jpg'],
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
      images: ['https://m.media-amazon.com/images/I/61SUkFGVURL._AC_SL1500_.jpg'],
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
      images: ['https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg'],
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
      images: ['https://m.media-amazon.com/images/I/61iS6kIGP+L._AC_SL1000_.jpg'],
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
      images: ['https://m.media-amazon.com/images/I/61pOVkjrVwL._AC_SL1500_.jpg'],
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
      images: ['https://m.media-amazon.com/images/I/61pxXgY07BL._AC_SL1500_.jpg'],
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
      images: ['https://m.media-amazon.com/images/I/51FWbV9OKVL._AC_SL1024_.jpg'],
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
      images: ['https://m.media-amazon.com/images/I/81Ow7LT1fuL._AC_SL1500_.jpg'],
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
      images: ['https://m.media-amazon.com/images/I/51Ke-K+6R0L._AC_SL1500_.jpg'],
      rating: 4.6,
      reviewCount: 14567,
      availability: 'En stock - Envío internacional disponible',
      category: 'Salud y cuidado personal',
      url: 'https://www.amazon.es/dp/B0CXLM3F4R?tag=' + this.affiliateTag,
      description: 'Protector solar facial Isdin Fusion Water SPF 50, fase acuosa para uso diario, 50ml.',
      region: 'ES'
    }
  ];

  getProductCount(region: string): number {
    return this.getProductsByRegion(region).length;
  }

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
