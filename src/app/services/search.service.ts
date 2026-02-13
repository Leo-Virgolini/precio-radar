import { Injectable, signal } from '@angular/core';

export interface SearchData {
  query: string;
  category: string;
  version: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchVersion = 0;
  private clearVersion = 0;

  private readonly _searchTrigger = signal<SearchData | null>(null);
  private readonly _clearTrigger = signal(0);

  readonly searchTrigger = this._searchTrigger.asReadonly();
  readonly clearTrigger = this._clearTrigger.asReadonly();

  triggerSearch(query: string, category: string = ''): void {
    this._searchTrigger.set({ query, category, version: ++this.searchVersion });
  }

  triggerClear(): void {
    this._clearTrigger.update(v => v + 1);
  }
}
