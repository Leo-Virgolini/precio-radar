
import { Component, signal, OnInit, inject, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SearchService } from '../../services/search.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, MegaMenuModule, ReactiveFormsModule, InputTextModule, SelectModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  private readonly searchService = inject(SearchService);
  private readonly formBuilder = inject(FormBuilder);

  isDark = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  searchForm!: FormGroup;

  private readonly clearEffect = effect(() => {
    const shouldClear = this.searchService.getClearTrigger()();
    if (shouldClear) {
      this.searchForm?.reset({ searchQuery: '', selectedCategory: '' });
      this.searchService.clearClearTrigger();
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
    { label: 'Juguetes y juegos', value: 'Juguetes y juegos', icon: 'pi pi-gift' }
  ];

  // MegaMenu data
  protected readonly megaMenuItems = [
    {
      label: 'Guía de Compra',
      icon: 'pi pi-book',
      items: [
        [
          {
            label: 'Cómo Comprar',
            items: [
              { label: 'Guía Completa', icon: 'pi pi-book', routerLink: '/guia-amazon' },
              { label: 'Envíos a Argentina', icon: 'pi pi-truck', routerLink: '/guia-amazon' },
              { label: 'Impuestos y Tarifas', icon: 'pi pi-calculator', routerLink: '/guia-amazon' }
            ]
          }
        ]
      ]
    },
    {
      label: 'Electrónicos',
      icon: 'pi pi-mobile',
      items: [
        [
          {
            label: 'Smartphones',
            items: [
              { label: 'iPhone', icon: 'pi pi-mobile' },
              { label: 'Samsung Galaxy', icon: 'pi pi-mobile' },
              { label: 'Google Pixel', icon: 'pi pi-mobile' }
            ]
          },
          {
            label: 'Computadoras',
            items: [
              { label: 'Laptops', icon: 'pi pi-desktop' },
              { label: 'Tablets', icon: 'pi pi-tablet' },
              { label: 'Accesorios', icon: 'pi pi-cog' }
            ]
          }
        ],
        [
          {
            label: 'Audio y Video',
            items: [
              { label: 'Auriculares', icon: 'pi pi-volume-up' },
              { label: 'Altavoces', icon: 'pi pi-volume-up' },
              { label: 'Smart TVs', icon: 'pi pi-desktop' }
            ]
          },
          {
            label: 'Gaming',
            items: [
              { label: 'Consolas', icon: 'pi pi-desktop' },
              { label: 'Videojuegos', icon: 'pi pi-play' },
              { label: 'Accesorios Gaming', icon: 'pi pi-cog' }
            ]
          }
        ]
      ]
    },
    {
      label: 'Hogar y Cocina',
      icon: 'pi pi-home',
      items: [
        [
          {
            label: 'Cocina',
            items: [
              { label: 'Electrodomésticos', icon: 'pi pi-cog' },
              { label: 'Utensilios', icon: 'pi pi-sun' },
              { label: 'Vajilla', icon: 'pi pi-circle' }
            ]
          },
          {
            label: 'Limpieza',
            items: [
              { label: 'Aspiradoras', icon: 'pi pi-cog' },
              { label: 'Productos de Limpieza', icon: 'pi pi-sun' },
              { label: 'Organizadores', icon: 'pi pi-box' }
            ]
          }
        ]
      ]
    },
    {
      label: 'Libros',
      icon: 'pi pi-book',
      items: [
        [
          {
            label: 'Categorías',
            items: [
              { label: 'Ficción', icon: 'pi pi-book' },
              { label: 'No Ficción', icon: 'pi pi-book' },
              { label: 'Técnicos', icon: 'pi pi-book' },
              { label: 'Infantiles', icon: 'pi pi-book' }
            ]
          }
        ]
      ]
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.initializeDarkMode();
    this.initializeSearchForm();
  }

  private initializeSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      searchQuery: ['', [Validators.required, Validators.minLength(2)]],
      selectedCategory: ['']
    });
  }

  private initializeDarkMode(): void {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const htmlElement = document.documentElement;

    if (savedTheme) {
      // Use saved preference
      this.isDark.set(savedTheme === 'dark');
      if (this.isDark()) {
        htmlElement.classList.add('my-app-dark');
      }
    } else {
      // Check system preference
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

    const htmlElement = document.documentElement;
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
    this.searchService.triggerSearch(query, formValue.selectedCategory || '');

    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

}
