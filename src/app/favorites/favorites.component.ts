import { Component, signal, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { FavoritesService } from '../services/favorites.service';
import { AmazonApiService } from '../services/amazon-api.service';
import { AmazonProduct } from '../models/product.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
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

  protected readonly products = signal<AmazonProduct[]>([]);
  protected readonly isLoading = signal(true);

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
    this.amazonApiService.getProductsByAsins(items).subscribe(products => {
      this.products.set(products);
      this.isLoading.set(false);
    });
  }

  protected removeFavorite(product: AmazonProduct): void {
    this.favoritesService.removeFavorite(product.asin);
    this.products.update(current => current.filter(p => p.asin !== product.asin));
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

  protected onImageError(event: any): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = 'sin_imagen.png';
      imgElement.alt = 'Sin imagen';
    }
  }

  protected getProductImage(product: AmazonProduct): string {
    return product.image || 'sin_imagen.png';
  }

  protected getDiscountPercentage(original: number, current: number): number {
    return Math.round(((original - current) / original) * 100);
  }

  protected formatPrice(price: number): string {
    return price.toFixed(2);
  }

  protected getCurrencySymbol(product: AmazonProduct): string {
    return product.region === 'ES' ? '€' : '$';
  }

  protected getCurrencyCode(product: AmazonProduct): string {
    return product.region === 'ES' ? 'EUR' : 'USD';
  }

  protected getRegionLabel(product: AmazonProduct): string {
    return product.region === 'ES' ? 'Amazon España' : 'Amazon USA';
  }

  protected getShippingPrice(product: AmazonProduct): number {
    return product.shipping.price;
  }

  protected formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }
}
