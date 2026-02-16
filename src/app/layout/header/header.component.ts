
import { Component, ChangeDetectionStrategy, signal, OnInit, inject, effect, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { BadgeModule } from 'primeng/badge';
import { InputGroupModule } from 'primeng/inputgroup';
import { SearchService } from '../../services/search.service';
import { FavoritesService } from '../../services/favorites.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, MegaMenuModule, ReactiveFormsModule, InputTextModule, SelectModule, RouterLink, BadgeModule, InputGroupModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  private readonly searchService = inject(SearchService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  protected readonly favoritesService = inject(FavoritesService);

  isDark = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  searchForm!: FormGroup;

  private lastClearVersion = 0;

  private readonly clearEffect = effect(() => {
    const clearVersion = this.searchService.clearTrigger();
    if (clearVersion > this.lastClearVersion) {
      this.lastClearVersion = clearVersion;
      this.searchForm?.reset({ searchQuery: '', selectedCategory: '' });
    }
  });

  // Categories for search
  protected readonly categories = [
    { label: 'Todas las categorías', value: '', icon: 'pi pi-th-large' },
    { label: 'Electrónicos', value: 'Electrónicos', icon: 'pi pi-mobile' },
    { label: 'Libros y medios', value: 'Libros y medios', icon: 'pi pi-book' },
    { label: 'Hogar y cocina', value: 'Hogar y cocina', icon: 'pi pi-home' },
    { label: 'Deportes y aire libre', value: 'Deportes y aire libre', icon: 'pi pi-sun' },
    { label: 'Moda', value: 'Moda', icon: 'pi pi-user' },
    { label: 'Salud y cuidado personal', value: 'Salud y cuidado personal', icon: 'pi pi-heart' },
    { label: 'Juguetes y juegos', value: 'Juguetes y juegos', icon: 'pi pi-gift' },
    { label: 'Herramientas y mejoras del hogar', value: 'Herramientas y mejoras del hogar', icon: 'pi pi-wrench' },
    { label: 'Belleza y cuidado personal', value: 'Belleza y cuidado personal', icon: 'pi pi-sparkles' }
  ];

  // MegaMenu data
  protected readonly megaMenuItems = [
    {
      label: 'Guía de Compra',
      icon: 'pi pi-book',
      badge: 'INFO',
      badgeSeverity: 'warn',
      items: [
        [
          {
            label: 'Cómo Comprar',
            items: [
              { label: 'Guía Paso a Paso', icon: 'pi pi-list-check', command: () => this.navigateToGuide('paso-a-paso') },
              { label: 'Restricciones', icon: 'pi pi-exclamation-triangle', command: () => this.navigateToGuide('restricciones') },
              { label: 'Impuestos y Tarifas', icon: 'pi pi-calculator', command: () => this.navigateToGuide('impuestos') }
            ]
          }
        ],
        [
          {
            label: 'Más Información',
            items: [
              { label: 'Consejos de Ahorro', icon: 'pi pi-wallet', command: () => this.navigateToGuide('consejos') },
              { label: 'Preguntas Frecuentes', icon: 'pi pi-question-circle', command: () => this.navigateToGuide('faq') }
            ]
          }
        ]
      ]
    }
  ];

  constructor() {
    afterNextRender(() => {
      this.initializeDarkMode();
    });
  }

  ngOnInit(): void {
    this.initializeSearchForm();
  }

  private initializeSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      searchQuery: [''],
      selectedCategory: ['']
    });
  }

  private initializeDarkMode(): void {
    const savedTheme = localStorage.getItem('theme');
    const htmlElement = this.document.documentElement;

    if (savedTheme) {
      this.isDark.set(savedTheme === 'dark');
      if (this.isDark()) {
        htmlElement.classList.add('my-app-dark');
      }
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark.set(prefersDark);
      if (prefersDark) {
        htmlElement.classList.add('my-app-dark');
      }
    }
  }

  toggleDarkMode(): void {
    const newDarkMode = !this.isDark();
    this.isDark.set(newDarkMode);

    const htmlElement = this.document.documentElement;
    if (newDarkMode) {
      htmlElement.classList.add('my-app-dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('my-app-dark');
      localStorage.setItem('theme', 'light');
    }
  }

  protected onGoHome(): void {
    this.searchForm.reset({ searchQuery: '', selectedCategory: '' });
    this.searchService.triggerSearch('', '');
  }

  protected onSearch(): void {
    const formValue = this.searchForm.value;
    const query = formValue.searchQuery?.trim() || '';

    this.isLoading.set(true);
    this.navigateAndSearch(query, formValue.selectedCategory || '');

    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  private navigateToGuide(fragment: string): void {
    this.router.navigate(['/guia-amazon']).then(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      setTimeout(() => {
        const element = this.document.getElementById(fragment);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
        }
      }, 100);
    });
  }

  private navigateAndSearch(query: string, category: string): void {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        this.searchService.triggerSearch(query, category);
      });
    } else {
      this.searchService.triggerSearch(query, category);
    }
  }

}
