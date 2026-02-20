import { Component, ChangeDetectionStrategy, signal, inject, OnInit, PLATFORM_ID, DestroyRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { FavoritesService } from '../services/favorites.service';
import { AmazonApiService } from '../services/amazon-api.service';
import { AmazonProduct } from '../models/product.model';
import { getDiscountPercentage, formatPrice, getCurrencySymbol, getCurrencyCode, getRegionLabel, getShippingPrice, getProductImages, formatNumber, handleImageError } from '../shared/product.utils';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    RatingModule,
    SkeletonModule,
    DialogModule,
    GalleriaModule,
    ImageModule
  ]
})
export class FavoritesComponent implements OnInit {

  private readonly favoritesService = inject(FavoritesService);
  private readonly amazonApiService = inject(AmazonApiService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);

  protected readonly products = signal<AmazonProduct[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly removingAsins = signal<Set<string>>(new Set());
  protected readonly selectedProduct = signal<AmazonProduct | null>(null);
  protected readonly showProductDialog = signal(false);
  protected readonly showAllFeatures = signal(false);
  protected readonly featuresOverflow = signal(false);
  protected readonly activeImageIndex = signal(0);
  @ViewChild('dialogFeatures') private dialogFeaturesEl?: ElementRef<HTMLElement>;

  protected readonly galleriaResponsiveOptions = [
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 2 }
  ];

  ngOnInit(): void {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const favorites = this.favoritesService.favorites();
    if (favorites.length === 0) {
      this.isLoading.set(false);
      return;
    }

    const items = favorites.map(f => ({ asin: f.asin, region: f.region }));
    this.amazonApiService.getProductsByAsins(items)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(products => {
        this.products.set(products);
        this.isLoading.set(false);
      });
  }

  protected removeFavorite(product: AmazonProduct): void {
    this.removingAsins.update(set => new Set([...set, product.asin]));
    setTimeout(() => {
      this.favoritesService.removeFavorite(product.asin);
      this.products.update(current => current.filter(p => p.asin !== product.asin));
      this.removingAsins.update(set => {
        const next = new Set(set);
        next.delete(product.asin);
        return next;
      });
      this.messageService.add({
        severity: 'info',
        summary: 'Eliminado de favoritos',
        detail: product.title.substring(0, 60) + (product.title.length > 60 ? '...' : ''),
        life: 1500
      });
    }, 300);
  }

  protected clearAll(): void {
    const count = this.products().length;
    this.favoritesService.clearAll();
    this.products.set([]);
    this.messageService.add({
      severity: 'info',
      summary: 'Favoritos eliminados',
      detail: `Se eliminaron ${count} productos de tus favoritos`,
      life: 1500
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

  protected onImageError(event: Event): void {
    handleImageError(event);
  }

  protected getDiscountPercentage(original: number, current: number): number {
    return getDiscountPercentage(original, current);
  }

  protected formatPrice(price: number): string {
    return formatPrice(price);
  }

  protected getCurrencySymbol(product: AmazonProduct): string {
    return getCurrencySymbol(product.currency);
  }

  protected getCurrencyCode(product: AmazonProduct): string {
    return getCurrencyCode(product.currency);
  }

  protected getRegionLabel(product: AmazonProduct): string {
    return getRegionLabel(product);
  }

  protected getShippingPrice(product: AmazonProduct): number {
    return getShippingPrice(product);
  }

  protected formatNumber(num: string): string {
    return formatNumber(num);
  }

  protected getProductImages(product: AmazonProduct): string[] {
    return getProductImages(product);
  }
}
