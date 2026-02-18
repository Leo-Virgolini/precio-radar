import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, Input, effect, untracked, PLATFORM_ID, DestroyRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';
import { DrawerModule } from 'primeng/drawer';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { GalleriaModule } from 'primeng/galleria';
import { AmazonApiService } from '../services/amazon-api.service';
import { AmazonProduct, SearchResponse } from '../models/product.model';
import { SearchService } from '../services/search.service';
import { FavoritesService } from '../services/favorites.service';
import { getDiscountPercentage, formatPrice, getCurrencySymbol, getCurrencyCode, getRegionLabel, getShippingPrice, getProductImages, formatNumber, handleImageError } from '../shared/product.utils';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    CardModule,
    DividerModule,
    TagModule,
    DataViewModule,
    SelectButtonModule,
    SliderModule,
    DialogModule,
    SkeletonModule,
    RatingModule,
    InputNumberModule,
    DrawerModule,
    ToggleSwitchModule,
    GalleriaModule
  ]
})
export class ProductSearchComponent implements OnInit {

  @Input() amazonRegion: string = 'US';
  @Input() searchQuery: string = '';
  @Input() searchCategory: string = '';

  @ViewChild('dataViewAnchor') private readonly dataViewAnchor!: ElementRef<HTMLElement>;

  private readonly amazonApiService = inject(AmazonApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly searchService = inject(SearchService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly favoritesService = inject(FavoritesService);
  private readonly messageService = inject(MessageService);

  // Reactive forms
  protected filterForm!: FormGroup;
  protected layoutForm!: FormGroup;

  // Effect for listening to search service (version-based to avoid setTimeout)
  // Initialize with current version to ignore searches triggered before this component existed
  private lastSearchVersion = this.searchService.searchTrigger()?.version ?? 0;
  private readonly searchEffect = effect(() => {
    const searchData = this.searchService.searchTrigger();
    if (searchData && searchData.version > this.lastSearchVersion) {
      this.lastSearchVersion = searchData.version;
      untracked(() => this.performSearch(searchData.query, searchData.category));
    }
  });

  // Signals for reactive state management
  protected readonly searchResults = signal<SearchResponse | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly currentPage = signal(1);

  // Store original unfiltered results for price filter
  private originalProducts: AmazonProduct[] = [];

  // Component data
  protected readonly categories = this.amazonApiService.categoryOptions;

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
  protected readonly isMobile = signal(isPlatformBrowser(this.platformId) && window.innerWidth < 768);
  protected readonly effectiveLayout = computed(() => this.isMobile() ? 'list' : this.selectedLayout());

  // Product detail dialog
  protected readonly selectedProduct = signal<AmazonProduct | null>(null);
  protected readonly showProductDialog = signal(false);
  protected readonly showAllFeatures = signal(false);
  protected readonly featuresOverflow = signal(false);
  protected readonly activeImageIndex = signal(0);
  @ViewChild('dialogFeatures') private dialogFeaturesEl?: ElementRef<HTMLElement>;

  // Filter drawer for mobile
  protected readonly showFilterDrawer = signal(false);

  // Skeleton loading items
  protected readonly skeletonItems = Array(8).fill(0);

  ngOnInit(): void {
    this.initializeForms();
    this.loadTopSellingProducts();
    this.setupMobileDetection();
  }

  private setupMobileDetection(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const checkMobile = () => this.isMobile.set(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    this.destroyRef.onDestroy(() => window.removeEventListener('resize', checkMobile));
  }

  private initializeForms(): void {
    this.filterForm = this.formBuilder.group({
      selectedCategory: [this.searchCategory || ''],
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

  protected onSearch(query?: string): void {
    const searchQuery = query || this.searchQuery;

    if (searchQuery && searchQuery.length < 2) {
      this.messageService.add({ severity: 'warn', summary: 'Búsqueda inválida', detail: 'Ingresá un término de búsqueda (mínimo 2 caracteres)', life: 1500 });
      return;
    }

    this.isLoading.set(true);

    // Category filtering is handled client-side by applyFilters, so don't pass category to API
    const search$ = searchQuery
      ? this.amazonApiService.searchProducts(searchQuery, this.currentPage(), 10, this.amazonRegion)
      : this.amazonApiService.getTopSellingProducts('', this.amazonRegion);

    search$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (results) => {
        this.originalProducts = results.products;
        this.searchResults.set(results);
        this.isLoading.set(false);
        this.applyFilters();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al buscar productos. Por favor, intenta nuevamente.', life: 1500 });
        this.isLoading.set(false);
        console.error('Search error:', error);
      }
    });
  }

  private loadTopSellingProducts(): void {
    this.amazonApiService.getTopSellingProducts('', this.amazonRegion)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          this.originalProducts = results.products;
          this.searchResults.set(results);
          this.isLoading.set(false);
          this.applyFilters();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los productos más vendidos', life: 1500 });
          this.isLoading.set(false);
          console.error('Error loading top products:', error);
        }
      });
  }

  protected openProductDetail(product: AmazonProduct): void {
    this.selectedProduct.set(product);
    this.showAllFeatures.set(false);
    this.featuresOverflow.set(false);
    this.activeImageIndex.set(0);
    this.showProductDialog.set(true);
    setTimeout(() => this.checkFeaturesOverflow());
  }

  private checkFeaturesOverflow(): void {
    const el = this.dialogFeaturesEl?.nativeElement;
    if (el) {
      this.featuresOverflow.set(el.scrollHeight > el.clientHeight + 1);
    }
  }

  protected openAmazonProduct(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank');
    }
  }

  protected toggleFavorite(product: AmazonProduct): void {
    const wasFavorite = this.favoritesService.isFavorite(product.asin);
    this.favoritesService.toggleFavorite(product.asin, product.region);
    this.messageService.add({
      severity: wasFavorite ? 'info' : 'success',
      summary: wasFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos',
      detail: product.title.substring(0, 60) + (product.title.length > 60 ? '...' : ''),
      life: 1500
    });
  }

  protected isFavorite(asin: string): boolean {
    return this.favoritesService.isFavorite(asin);
  }

  protected onImageError(event: Event): void {
    handleImageError(event);
  }

  protected getDiscountPercentage(original: number, current: number): number {
    return getDiscountPercentage(original, current);
  }

  protected formatNumber(num: string): string {
    return formatNumber(num);
  }

  protected onPageChange(): void {
    this.scrollToDataView();
  }

  private scrollToDataView(): void {
    if (isPlatformBrowser(this.platformId) && this.dataViewAnchor) {
      this.dataViewAnchor.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        sortedProducts.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'bestsellers':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-desc':
        sortedProducts.sort((a, b) => b.rating - a.rating || parseFloat(b.ratingCount.replace(/,/g, '')) - parseFloat(a.ratingCount.replace(/,/g, '')));
        break;
      case 'total-asc':
        sortedProducts.sort((a, b) => this.getTotalPrice(a) - this.getTotalPrice(b));
        break;
      case 'total-desc':
        sortedProducts.sort((a, b) => this.getTotalPrice(b) - this.getTotalPrice(a));
        break;
      case 'discount-desc':
        sortedProducts.sort((a, b) => {
          const discountA = a.originalPrice ? ((a.originalPrice - a.currentPrice) / a.originalPrice) * 100 : 0;
          const discountB = b.originalPrice ? ((b.originalPrice - b.currentPrice) / b.originalPrice) * 100 : 0;
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
      if (product.currentPrice < minPrice || product.currentPrice > maxPrice) return false;
      if (freeShippingOnly && !this.isFreeShipping(product)) return false;
      if (freeShippingThreshold && !this.isFreeShippingByThreshold(product)) return false;
      if (discountOnly && !product.originalPrice) return false;
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

  protected getProductImages(product: AmazonProduct): string[] {
    return getProductImages(product);
  }

  protected readonly galleriaResponsiveOptions = [
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 2 }
  ];

  protected getTotalPrice(product: AmazonProduct): number {
    return product.currentPrice + product.shippingPrice;
  }

  protected getShippingPrice(product: AmazonProduct): number {
    return getShippingPrice(product);
  }

  protected isFreeShipping(product: AmazonProduct): boolean {
    return product.shippingPrice === 0;
  }

  protected isFreeShippingByThreshold(product: AmazonProduct): boolean {
    return product.freeShippingOver99;
  }


  protected formatPrice(price: number): string {
    return formatPrice(price);
  }

  protected getProductRegion(product: AmazonProduct): string {
    return this.amazonRegion === 'ALL' ? product.region : this.amazonRegion;
  }

  protected getCurrencySymbol(product?: AmazonProduct): string {
    return getCurrencySymbol(product?.currency ?? (this.amazonRegion === 'ES' ? 'EUR' : 'USD'));
  }

  protected getCurrencyCode(product?: AmazonProduct): string {
    return getCurrencyCode(product?.currency ?? (this.amazonRegion === 'ES' ? 'EUR' : 'USD'));
  }

  protected getRegionLabel(product: AmazonProduct): string {
    return getRegionLabel(product);
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
    this.filterForm?.patchValue({ selectedCategory: category });
    this.onSearch(query);
  }

}
