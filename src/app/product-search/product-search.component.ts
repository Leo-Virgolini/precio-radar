import { Component, signal, inject, OnInit, Input, effect, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { MegaMenuModule } from 'primeng/megamenu';
import { DataViewModule } from 'primeng/dataview';
import { SliderModule } from 'primeng/slider';
import { ImageModule } from 'primeng/image';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { AmazonApiService } from '../services/amazon-api.service';
import { AmazonProduct, SearchResponse } from '../models/product.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SearchService } from '../services/search.service';
import { FavoritesService } from '../services/favorites.service';
import { SkeletonModule } from 'primeng/skeleton';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';
import { DrawerModule } from 'primeng/drawer';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PopoverModule } from 'primeng/popover';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    CardModule,
    MessageModule,
    ImageModule,
    DividerModule,
    TagModule,
    MegaMenuModule,
    DataViewModule,
    SelectButtonModule,
    SliderModule,
    BadgeModule,
    TooltipModule,
    DialogModule,
    SkeletonModule,
    RatingModule,
    InputNumberModule,
    DrawerModule,
    ToggleSwitchModule,
    PopoverModule
  ]
})
export class ProductSearchComponent implements OnInit {

  @Input() amazonRegion: string = 'US';
  @Input() searchQuery: string = '';
  @Input() searchCategory: string = '';

  private readonly amazonApiService = inject(AmazonApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly searchService = inject(SearchService);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly favoritesService = inject(FavoritesService);

  // Reactive forms
  protected filterForm!: FormGroup;
  protected layoutForm!: FormGroup;

  // Effect for listening to search service (version-based to avoid setTimeout)
  private lastSearchVersion = 0;
  private readonly searchEffect = effect(() => {
    const searchData = this.searchService.searchTrigger();
    if (searchData && searchData.version > this.lastSearchVersion) {
      this.lastSearchVersion = searchData.version;
      if (searchData.query || searchData.category) {
        this.performSearch(searchData.query, searchData.category);
      } else {
        this.resetFilters();
      }
    }
  });

  // Signals for reactive state management
  protected readonly searchResults = signal<SearchResponse | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly currentPage = signal(1);

  // Store original unfiltered results for price filter
  private originalProducts: AmazonProduct[] = [];

  // Component data
  protected readonly categories = [
    { label: 'Todas las categorías', value: '', icon: 'pi pi-th-large' },
    { label: 'Electrónicos', value: 'Electrónicos', icon: 'pi pi-mobile' },
    { label: 'Libros y medios', value: 'Libros y medios', icon: 'pi pi-book' },
    { label: 'Hogar y cocina', value: 'Hogar y cocina', icon: 'pi pi-home' },
    { label: 'Deportes y aire libre', value: 'Deportes y aire libre', icon: 'pi pi-sun' },
    { label: 'Moda', value: 'Moda', icon: 'pi pi-user' },
    { label: 'Salud y cuidado personal', value: 'Salud y cuidado personal', icon: 'pi pi-heart' },
    { label: 'Juguetes y juegos', value: 'Juguetes y juegos', icon: 'pi pi-gift' }
  ];

  // DataView properties
  protected readonly layoutOptions = [
    { label: 'Vista de Lista', icon: 'pi pi-list', value: 'list' },
    { label: 'Vista de Cuadrícula', icon: 'pi pi-th-large', value: 'grid' }
  ];
  protected readonly sortOptions = [
    { label: 'Relevancia', value: 'relevance', icon: 'pi pi-search' },
    { label: 'Más Vendidos', value: 'bestsellers', icon: 'pi pi-trophy' },
    { label: 'Mejor Calificación', value: 'rating-desc', icon: 'pi pi-star-fill' },
    { label: 'Precio: Menor a Mayor', value: 'price-asc', icon: 'pi pi-sort-amount-up' },
    { label: 'Precio: Mayor a Menor', value: 'price-desc', icon: 'pi pi-sort-amount-down' },
    { label: 'Precio Total: Menor a Mayor', value: 'total-asc', icon: 'pi pi-sort-amount-up' },
    { label: 'Precio Total: Mayor a Menor', value: 'total-desc', icon: 'pi pi-sort-amount-down' },
    { label: 'Mayor Descuento', value: 'discount-desc', icon: 'pi pi-percentage' },
    { label: 'Más Recientes', value: 'newest', icon: 'pi pi-clock' }
  ];
  protected readonly maxPriceLimit = 10000;

  protected readonly regionOptions = [
    { label: 'Todas las regiones', value: '', icon: 'pi pi-globe', flag: '' },
    { label: 'Amazon USA', value: 'US', icon: 'pi pi-globe', flag: 'https://flagcdn.com/16x12/us.png' },
    { label: 'Amazon España', value: 'ES', icon: 'pi pi-globe', flag: 'https://flagcdn.com/16x12/es.png' }
  ];

  protected readonly selectedLayout = signal<'grid' | 'list'>('grid');

  // Product detail dialog
  protected readonly selectedProduct = signal<AmazonProduct | null>(null);
  protected readonly showProductDialog = signal(false);

  // Filter drawer for mobile
  protected readonly showFilterDrawer = signal(false);

  // Skeleton loading items
  protected readonly skeletonItems = Array(8).fill(0);

  ngOnInit(): void {
    this.initializeForms();
    this.loadTopSellingProducts();
  }

  private initializeForms(): void {
    this.filterForm = this.formBuilder.group({
      selectedCategory: [''],
      priceRange: [[0, this.maxPriceLimit]],
      freeShippingOnly: [false],
      freeShippingThreshold: [false],
      discountOnly: [false],
      minRating: [0],
      regionFilter: [''],
      selectedSort: ['relevance']
    });

    this.layoutForm = this.formBuilder.group({
      selectedLayout: ['grid']
    });
  }

  protected onSearch(query?: string, category?: string): void {
    const searchQuery = query || this.searchQuery;
    const searchCategory = category || this.searchCategory;

    // Allow search by category alone (no query needed)
    if (!searchQuery && !searchCategory) {
      this.errorMessage.set('Por favor, ingresa un término de búsqueda válido (mínimo 2 caracteres)');
      return;
    }

    if (searchQuery && searchQuery.length < 2) {
      this.errorMessage.set('Por favor, ingresa un término de búsqueda válido (mínimo 2 caracteres)');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // If only category, use getTopSellingProducts; otherwise search with query (and optional category filter)
    const search$ = searchQuery
      ? this.amazonApiService.searchProducts(searchQuery, this.currentPage(), 10, this.amazonRegion, searchCategory || undefined)
      : this.amazonApiService.getTopSellingProducts(searchCategory, this.amazonRegion);

    search$.subscribe({
      next: (results) => {
        this.originalProducts = results.products;
        this.searchResults.set(results);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al buscar productos. Por favor, intenta nuevamente.');
        this.isLoading.set(false);
        console.error('Search error:', error);
      }
    });
  }

  private loadTopSellingProducts(): void {
    const selectedCategory = this.searchCategory || '';
    this.amazonApiService.getTopSellingProducts(selectedCategory, this.amazonRegion)
      .subscribe({
        next: (results) => {
          this.originalProducts = results.products;
          this.searchResults.set(results);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set('Error al cargar los productos más vendidos');
          this.isLoading.set(false);
          console.error('Error loading top products:', error);
        }
      });
  }

  protected sortByPrice(): void {
    const results = this.searchResults();
    if (results) {
      const sortedProducts = [...results.products].sort((a, b) => a.price.current - b.price.current);
      this.searchResults.set({ ...results, products: sortedProducts });
    }
  }

  protected sortByRating(): void {
    const results = this.searchResults();
    if (results) {
      const sortedProducts = [...results.products].sort((a, b) => b.rating - a.rating);
      this.searchResults.set({ ...results, products: sortedProducts });
    }
  }

  protected openProductDetail(product: AmazonProduct): void {
    this.selectedProduct.set(product);
    this.showProductDialog.set(true);
  }

  protected openAmazonProduct(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank');
    }
  }

  protected toggleFavorite(product: AmazonProduct): void {
    this.favoritesService.toggleFavorite(product.asin, product.region);
  }

  protected isFavorite(asin: string): boolean {
    return this.favoritesService.isFavorite(asin);
  }

  onImageError(event: any): void {
    // Update the image source to show default image
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = 'sin_imagen.png';
      imgElement.alt = 'Sin imagen';
    }
  }

  protected trackByAsin(index: number, product: AmazonProduct): string {
    return product.asin;
  }

  protected getDiscountPercentage(original: number, current: number): number {
    return Math.round(((original - current) / original) * 100);
  }

  protected getAvailabilityClass(availability: string): string {
    if (availability.toLowerCase().includes('stock')) return 'bg-green-100 text-green-800';
    if (availability.toLowerCase().includes('poco')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  protected formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  protected getPageNumbers(): number[] {
    const totalPages = this.searchResults()?.totalPages || 1;
    const current = this.currentPage();
    const pages: number[] = [];

    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  protected goToPage(page: number): void {
    this.currentPage.set(page);
    this.onSearch(this.searchQuery, this.searchCategory);
  }

  // DataView methods
  protected onLayoutChange(layout: 'grid' | 'list'): void {
    this.selectedLayout.set(layout);
    this.layoutForm.patchValue({ selectedLayout: layout });
  }

  protected onSortChange(sort: string): void {
    this.filterForm.patchValue({ selectedSort: sort });
    this.sortProducts(sort);
  }

  private sortProducts(sort: string): void {
    const results = this.searchResults();
    if (!results) return;

    let sortedProducts = [...results.products];

    switch (sort) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price.current - b.price.current);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price.current - a.price.current);
        break;
      case 'bestsellers':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-desc':
        sortedProducts.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'total-asc':
        sortedProducts.sort((a, b) => this.getTotalPrice(a) - this.getTotalPrice(b));
        break;
      case 'total-desc':
        sortedProducts.sort((a, b) => this.getTotalPrice(b) - this.getTotalPrice(a));
        break;
      case 'discount-desc':
        sortedProducts.sort((a, b) => {
          const discountA = a.price.original ? ((a.price.original - a.price.current) / a.price.original) * 100 : 0;
          const discountB = b.price.original ? ((b.price.original - b.price.current) / b.price.original) * 100 : 0;
          return discountB - discountA;
        });
        break;
      case 'newest':
        // Sort by ASIN (newer ASINs first)
        sortedProducts.sort((a, b) => b.asin.localeCompare(a.asin));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    this.searchResults.set({
      ...results,
      products: sortedProducts
    });
  }

  protected applyFilters(): void {
    const results = this.searchResults();
    if (!results) return;

    const priceRange = this.filterForm.get('priceRange')?.value || [0, this.maxPriceLimit];
    const minPrice = priceRange[0];
    const maxPrice = priceRange[1];
    const freeShippingOnly = this.filterForm.get('freeShippingOnly')?.value || false;
    const freeShippingThreshold = this.filterForm.get('freeShippingThreshold')?.value || false;
    const discountOnly = this.filterForm.get('discountOnly')?.value || false;
    const minRating = this.filterForm.get('minRating')?.value || 0;
    const selectedCategory = this.filterForm.get('selectedCategory')?.value || '';
    const regionFilter = this.filterForm.get('regionFilter')?.value || '';

    const filteredProducts = this.originalProducts.filter((product: AmazonProduct) => {
      if (product.price.current < minPrice || product.price.current > maxPrice) return false;
      if (freeShippingOnly && !this.isFreeShipping(product)) return false;
      if (freeShippingThreshold && !this.isFreeShippingByThreshold(product)) return false;
      if (discountOnly && !product.price.original) return false;
      if (minRating > 0 && product.rating < minRating) return false;
      if (selectedCategory && product.category !== selectedCategory) return false;
      if (regionFilter && product.region !== regionFilter) return false;
      return true;
    });

    this.searchResults.set({
      ...results,
      products: filteredProducts,
      totalResults: filteredProducts.length
    });

    // Re-apply current sort after filtering
    const currentSort = this.filterForm.get('selectedSort')?.value;
    if (currentSort && currentSort !== 'relevance') {
      this.sortProducts(currentSort);
    }
  }

  protected getProductImage(product: AmazonProduct): string {
    return product.image || 'sin_imagen.png';
  }

  protected getTotalPrice(product: AmazonProduct): number {
    return product.price.current + product.shipping.price;
  }

  protected getShippingPrice(product: AmazonProduct): number {
    return product.shipping.price;
  }

  protected isFreeShipping(product: AmazonProduct): boolean {
    const region = this.getProductRegion(product);
    if (region === 'ES') return false; // Amazon España no ofrece envío gratis a Argentina
    return product.shipping.price === 0 || product.price.current >= 99;
  }

  protected isFreeShippingByThreshold(product: AmazonProduct): boolean {
    const region = this.getProductRegion(product);
    if (region === 'ES') return false;
    return product.shipping.price > 0 && product.price.current >= 99;
  }


  protected formatPrice(price: number): string {
    return price.toFixed(2);
  }

  protected getProductRegion(product: AmazonProduct): string {
    return this.amazonRegion === 'ALL' ? product.region : this.amazonRegion;
  }

  protected getCurrencySymbol(product?: AmazonProduct): string {
    const region = product ? this.getProductRegion(product) : this.amazonRegion;
    return region === 'ES' ? '€' : '$';
  }

  protected getCurrencyCode(product?: AmazonProduct): string {
    const region = product ? this.getProductRegion(product) : this.amazonRegion;
    return region === 'ES' ? 'EUR' : 'USD';
  }

  protected getFreeShippingThreshold(product?: AmazonProduct): string {
    const region = product ? this.getProductRegion(product) : this.amazonRegion;
    return region === 'ES' ? '' : '$99+';
  }

  protected getRegionLabel(product: AmazonProduct): string {
    return product.region === 'ES' ? 'Amazon España' : 'Amazon USA';
  }

  private resetFilters(): void {
    this.filterForm?.patchValue({
      selectedCategory: '',
      priceRange: [0, this.maxPriceLimit],
      freeShippingOnly: false,
      freeShippingThreshold: false,
      discountOnly: false,
      minRating: 0,
      regionFilter: '',
      selectedSort: 'relevance'
    });
    this.searchQuery = '';
    this.searchCategory = '';
    this.loadTopSellingProducts();
  }

  protected clearFilters(): void {
    this.resetFilters();
    this.searchService.triggerClear();
  }

  protected onPriceInputChange(index: number, value: number | null): void {
    const priceRange = [...(this.filterForm.get('priceRange')?.value || [0, this.maxPriceLimit])];
    priceRange[index] = value ?? (index === 0 ? 0 : this.maxPriceLimit);
    this.filterForm.patchValue({ priceRange });
    this.applyFilters();
  }

  // Public method to be called from parent component
  public performSearch(query: string, category: string = ''): void {
    this.searchQuery = query;
    this.searchCategory = category;
    this.onSearch(query, category);
  }

}
