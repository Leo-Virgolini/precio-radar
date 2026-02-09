import { Injectable, signal, computed } from '@angular/core';

export interface SearchData {
  query: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly searchTrigger = signal<SearchData | null>(null);
  private readonly clearTrigger = signal(false);

  triggerSearch(query: string, category: string = ''): void {
    this.searchTrigger.set({ query, category });
  }

  getSearchTrigger() {
    return this.searchTrigger.asReadonly();
  }

  clearSearchTrigger(): void {
    this.searchTrigger.set(null);
  }

  triggerClear(): void {
    this.clearTrigger.set(true);
  }

  getClearTrigger() {
    return this.clearTrigger.asReadonly();
  }

  clearClearTrigger(): void {
    this.clearTrigger.set(false);
  }

}
