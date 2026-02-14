import { Component, ChangeDetectionStrategy, signal, inject, OnInit, PLATFORM_ID, DestroyRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { FavoritesService } from '../services/favorites.service';
import { AmazonApiService } from '../services/amazon-api.service';
import { AmazonProduct } from '../models/product.model';
import { getDiscountPercentage, formatPrice, getCurrencySymbol, getCurrencyCode, getRegionLabel, getShippingPrice, getProductImage, formatNumber, handleImageError } from '../shared/product.utils';

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
    SkeletonModule
  ]
})
export class FavoritesComponent implements OnInit {

  private readonly favoritesService = inject(FavoritesService);
  private readonly amazonApiService = inject(AmazonApiService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly products = signal<AmazonProduct[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly removingAsins = signal<Set<string>>(new Set());

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
    }, 300);
  }

  protected clearAll(): void {
    this.favoritesService.clearAll();
    this.products.set([]);
  }

  protected openAmazonProduct(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank');
    }
  }

  protected onImageError(event: Event): void {
    handleImageError(event);
  }

  protected getProductImage(product: AmazonProduct): string {
    return getProductImage(product);
  }

  protected getDiscountPercentage(original: number, current: number): number {
    return getDiscountPercentage(original, current);
  }

  protected formatPrice(price: number): string {
    return formatPrice(price);
  }

  protected getCurrencySymbol(product: AmazonProduct): string {
    return getCurrencySymbol(product.region);
  }

  protected getCurrencyCode(product: AmazonProduct): string {
    return getCurrencyCode(product.region);
  }

  protected getRegionLabel(product: AmazonProduct): string {
    return getRegionLabel(product);
  }

  protected getShippingPrice(product: AmazonProduct): number {
    return getShippingPrice(product);
  }

  protected formatNumber(num: number): string {
    return formatNumber(num);
  }
}
