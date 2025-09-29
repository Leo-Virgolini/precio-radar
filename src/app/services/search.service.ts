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

  // Method to trigger a search
  triggerSearch(query: string, category: string = ''): void {
    this.searchTrigger.set({ query, category });
  }

  // Signal to listen for search triggers
  getSearchTrigger() {
    return this.searchTrigger.asReadonly();
  }

  // Method to clear the search trigger
  clearSearchTrigger(): void {
    this.searchTrigger.set(null);
  }

}
