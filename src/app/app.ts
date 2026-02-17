import { Component, ChangeDetectionStrategy, inject, OnInit, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly BASE_URL = 'https://precioradar.com.ar';
  private readonly defaultTitle = 'PrecioRadar | Rastreá los mejores precios internacionales con envío a Argentina';
  private readonly defaultDescription = 'PrecioRadar: Tu radar de precios internacionales con envío a Argentina. Compará ofertas de las principales tiendas online del mundo y ahorrá en tus compras.';

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => {
      const title = data['title'] || this.defaultTitle;
      const description = data['description'] || this.defaultDescription;
      const robots = data['robots'] || 'index, follow';
      const ogType = data['ogType'] || 'website';
      const path = this.router.url.split('?')[0].split('#')[0];
      const url = this.BASE_URL + (path === '/' ? '/' : path);

      this.titleService.setTitle(title);

      this.metaService.updateTag({ name: 'description', content: description });
      this.metaService.updateTag({ name: 'robots', content: robots });

      // Canonical
      let canonical: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', url);
      }

      // Open Graph
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ property: 'og:url', content: url });
      this.metaService.updateTag({ property: 'og:type', content: ogType });

      // Twitter Card
      this.metaService.updateTag({ name: 'twitter:title', content: title });
      this.metaService.updateTag({ name: 'twitter:description', content: description });

      // JSON-LD
      this.updateJsonLd(path, title, description, data['breadcrumb']);
    });
  }

  private updateJsonLd(path: string, title: string, description: string, breadcrumb?: string): void {
    // Remove previous dynamic JSON-LD scripts (not FAQPage which has its own id)
    this.document.querySelectorAll('script[type="application/ld+json"]:not([id])').forEach(el => el.remove());

    const schemas: object[] = [];

    // BreadcrumbList for non-home pages
    if (path !== '/' && path !== '' && breadcrumb) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Inicio',
            'item': this.BASE_URL
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': breadcrumb,
            'item': this.BASE_URL + path
          }
        ]
      });
    }

    // Page-specific schemas
    if (path === '/' || path === '') {
      schemas.push(
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'PrecioRadar',
          'url': this.BASE_URL,
          'logo': this.BASE_URL + '/og-image.png',
          'description': this.defaultDescription
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'PrecioRadar',
          'url': this.BASE_URL,
          'description': this.defaultDescription,
          'inLanguage': 'es',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': this.BASE_URL + '/?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }
      );
    } else if (path === '/guia-de-compra') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': 'Guía Definitiva: Cómo Comprar en Amazon desde Argentina',
        'description': description,
        'author': { '@type': 'Organization', 'name': 'PrecioRadar', 'url': this.BASE_URL },
        'publisher': {
          '@type': 'Organization',
          'name': 'PrecioRadar',
          'logo': { '@type': 'ImageObject', 'url': this.BASE_URL + '/og-image.png' }
        },
        'mainEntityOfPage': { '@type': 'WebPage', '@id': this.BASE_URL + '/guia-de-compra' },
        'inLanguage': 'es',
        'datePublished': '2025-01-15',
        'dateModified': new Date().toISOString().split('T')[0]
      });
    } else if (path === '/sobre-nosotros') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': 'Sobre Nosotros - PrecioRadar',
        'description': description,
        'url': this.BASE_URL + '/sobre-nosotros',
        'mainEntity': { '@type': 'Organization', 'name': 'PrecioRadar', 'url': this.BASE_URL }
      });
    }

    if (schemas.length > 0) {
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      this.document.head.appendChild(script);
    }
  }
}
