import { Injectable, signal } from '@angular/core';

export interface SearchData {
  query: string;
  category: string;
  version: number;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  priceRange: number[];
  inStockOnly: boolean;
  freeShippingOnly: boolean;
  freeShippingThreshold: boolean;
  discountOnly: boolean;
  minRating: number;
  regionFilter: string;
  selectedSort: { label: string; value: string; icon: string };
  selectedLayout: 'grid' | 'list';
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchVersion = 0;

  private readonly _searchTrigger = signal<SearchData | null>(null);
  private readonly _clearTrigger = signal(0);
  private readonly _filterState = signal<FilterState | null>(null);
  private readonly _filteredCount = signal<Record<string, number>>({});

  readonly searchTrigger = this._searchTrigger.asReadonly();
  readonly clearTrigger = this._clearTrigger.asReadonly();
  readonly filterState = this._filterState.asReadonly();
  readonly filteredCount = this._filteredCount.asReadonly();

  triggerSearch(query: string, category: string = ''): void {
    this._searchTrigger.set({ query, category, version: ++this.searchVersion });
  }

  triggerClear(): void {
    this._clearTrigger.update(v => v + 1);
  }

  saveFilterState(state: FilterState): void {
    this._filterState.set(state);
  }

  clearFilterState(): void {
    this._filterState.set(null);
  }

  setFilteredCount(region: string, count: number): void {
    this._filteredCount.update(current => ({ ...current, [region]: count }));
  }

  getFilteredCount(region: string): number | null {
    return this._filteredCount()[region] ?? null;
  }

  clearFilteredCounts(): void {
    this._filteredCount.set({});
  }
}
