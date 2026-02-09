import { Component, signal, inject, OnInit, Input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { MegaMenuModule } from 'primeng/megamenu';
import { DataViewModule } from 'primeng/dataview';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageModule } from 'primeng/image';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { AmazonApiService, AmazonProduct, SearchResponse } from '../services/amazon-api.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    CardModule,
    ProgressSpinnerModule,
    MessageModule,
    ImageModule,
    DividerModule,
    TagModule,
    MegaMenuModule,
    DataViewModule,
    SelectButtonModule,
    SliderModule,
    CheckboxModule,
    BadgeModule,
    TooltipModule
  ]
})
export class ProductSearchComponent implements OnInit {

  @Input() amazonRegion: string = 'US';
  @Input() searchQuery: string = '';
  @Input() searchCategory: string = '';

  private readonly amazonApiService = inject(AmazonApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly searchService = inject(SearchService);

  // Reactive forms
  protected filterForm!: FormGroup;
  protected layoutForm!: FormGroup;

  // Effect for listening to search service
  private readonly searchEffect = effect(() => {
    const searchData = this.searchService.getSearchTrigger()();
    if (searchData) {
      if (searchData.query) {
        this.performSearch(searchData.query, searchData.category);
      } else {
        this.resetFilters();
      }
      this.searchService.clearSearchTrigger();
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

  protected readonly quickActions = [
    { label: 'Más Vendidos', icon: 'pi pi-trophy', action: 'bestsellers' },
    { label: 'Ofertas del Día', icon: 'pi pi-percentage', action: 'deals' },
    { label: 'Nuevos Lanzamientos', icon: 'pi pi-star', action: 'new' },
    { label: 'Electrónicos', icon: 'pi pi-mobile', action: 'electronics' },
    { label: 'Libros', icon: 'pi pi-book', action: 'books' }
  ];

  // DataView properties
  protected readonly layoutOptions = [
    { label: 'Vista de Lista', icon: 'pi pi-list', value: 'list' },
    { label: 'Vista de Cuadrícula', icon: 'pi pi-th-large', value: 'grid' }
  ];
  protected readonly sortOptions = [
    { label: 'Relevancia', value: 'relevance', icon: 'pi pi-search' },
    { label: 'Precio: Menor a Mayor', value: 'price-asc', icon: 'pi pi-sort-amount-up' },
    { label: 'Precio: Mayor a Menor', value: 'price-desc', icon: 'pi pi-sort-amount-down' },
    { label: 'Mayor Descuento', value: 'discount-desc', icon: 'pi pi-percentage' },
    { label: 'Más Recientes', value: 'newest', icon: 'pi pi-clock' }
  ];
  protected readonly maxPrice = 10000;

  protected readonly selectedLayout = signal<'grid' | 'list'>('grid');

  ngOnInit(): void {
    this.initializeForms();
    this.loadTopSellingProducts();
  }

  private initializeForms(): void {
    this.filterForm = this.formBuilder.group({
      selectedCategory: [''],
      maxPrice: [this.maxPrice],
      freeShippingOnly: [false],
      selectedSort: ['relevance']
    });

    this.layoutForm = this.formBuilder.group({
      selectedLayout: ['grid']
    });
  }

  protected onSearch(query?: string, category?: string): void {
    const searchQuery = query || this.searchQuery;
    const searchCategory = category || this.searchCategory;

    if (!searchQuery || searchQuery.length < 2) {
      this.errorMessage.set('Por favor, ingresa un término de búsqueda válido (mínimo 2 caracteres)');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.amazonApiService.searchProducts(searchQuery, this.currentPage(), 10, this.amazonRegion)
      .subscribe({
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

  protected onQuickAction(action: any): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    switch (action.action) {
      case 'bestsellers':
        this.loadTopSellingProducts();
        break;
      case 'deals':
        this.onSearch('ofertas descuento');
        break;
      case 'new':
        this.onSearch('nuevos productos');
        break;
      case 'electronics':
        this.onSearch('electrónicos', 'Electrónicos');
        break;
      case 'books':
        this.onSearch('libros', 'Libros y medios');
        break;
    }
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

  protected openAmazonProduct(url: string): void {
    window.open(url, '_blank');
  }

  protected addToFavorites(product: AmazonProduct): void {
    // In a real app, you would implement favorites functionality
    console.log('Added to favorites:', product.title);
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
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
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

    const maxPrice = this.filterForm.get('maxPrice')?.value || this.maxPrice;
    const freeShippingOnly = this.filterForm.get('freeShippingOnly')?.value || false;
    const selectedCategory = this.filterForm.get('selectedCategory')?.value || '';

    const filteredProducts = this.originalProducts.filter((product: AmazonProduct) => {
      if (product.price.current > maxPrice) return false;
      if (freeShippingOnly && !this.isFreeShipping(product)) return false;
      if (selectedCategory && product.category !== selectedCategory) return false;
      return true;
    });

    this.searchResults.set({
      ...results,
      products: filteredProducts,
      totalResults: filteredProducts.length
    });
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
    return product.shipping.price === 0;
  }


  protected formatPrice(price: number): string {
    return price.toFixed(2);
  }

  protected getCurrencySymbol(): string {
    return this.amazonRegion === 'ES' ? '€' : '$';
  }

  protected getCurrencyCode(): string {
    return this.amazonRegion === 'ES' ? 'EUR' : 'USD';
  }

  protected getFreeShippingThreshold(): string {
    return this.amazonRegion === 'ES' ? '€29+' : '$99+';
  }

  private resetFilters(): void {
    this.filterForm?.patchValue({
      selectedCategory: '',
      maxPrice: this.maxPrice,
      freeShippingOnly: false,
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

  // Public method to be called from parent component
  public performSearch(query: string, category: string = ''): void {
    this.searchQuery = query;
    this.searchCategory = category;
    this.onSearch(query, category);
  }

}
