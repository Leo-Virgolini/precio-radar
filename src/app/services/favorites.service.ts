import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FavoriteItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private readonly STORAGE_KEY = 'favorites';
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _favorites = signal<FavoriteItem[]>(this.loadFromStorage());

  readonly favorites = this._favorites.asReadonly();
  readonly count = computed(() => this._favorites().length);

  toggleFavorite(asin: string, region: 'US' | 'ES'): void {
    if (this.isFavorite(asin)) {
      this.removeFavorite(asin);
    } else {
      const updated = [...this._favorites(), { asin, region, dateAdded: Date.now() }];
      this._favorites.set(updated);
      this.saveToStorage(updated);
    }
  }

  removeFavorite(asin: string): void {
    const updated = this._favorites().filter(f => f.asin !== asin);
    this._favorites.set(updated);
    this.saveToStorage(updated);
  }

  isFavorite(asin: string): boolean {
    return this._favorites().some(f => f.asin === asin);
  }

  clearAll(): void {
    this._favorites.set([]);
    this.saveToStorage([]);
  }

  private loadFromStorage(): FavoriteItem[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: FavoriteItem[]): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}
