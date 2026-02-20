import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./amazon-tabs/amazon-tabs.component').then(m => m.AmazonTabsComponent),
        data: {
          title: 'PrecioRadar | Rastreá los mejores precios internacionales con envío a Argentina',
          description: 'Compará precios de Amazon USA y Amazon España con envío a Argentina. Encontrá las mejores ofertas internacionales con PrecioRadar.',
          robots: 'index, follow',
          breadcrumb: 'Inicio'
        }
      },
      {
        path: 'guia-de-compra',
        loadComponent: () => import('./buying-guide/buying-guide.component').then(m => m.BuyingGuideComponent),
        data: {
          title: 'Guía Definitiva: Cómo Comprar en Amazon desde Argentina (2026) | PrecioRadar',
          description: 'Guía completa y actualizada para comprar en Amazon desde Argentina. Paso a paso, impuestos, restricciones, envío gratis en pedidos de $99 USD y consejos para ahorrar.',
          robots: 'index, follow',
          ogType: 'article',
          breadcrumb: 'Guía Amazon'
        }
      },
      {
        path: 'privacidad',
        loadComponent: () => import('./privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
        data: {
          title: 'Política de Privacidad | PrecioRadar',
          description: 'Política de privacidad de PrecioRadar. Conocé cómo protegemos tus datos y tu información personal.',
          robots: 'noindex, follow',
          breadcrumb: 'Privacidad'
        }
      },
      {
        path: 'sobre-nosotros',
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent),
        data: {
          title: 'Sobre Nosotros | PrecioRadar',
          description: 'Conocé PrecioRadar: tu radar de precios internacionales con envío a Argentina. Misión, cómo funciona y divulgación de afiliados de Amazon.',
          robots: 'index, follow',
          breadcrumb: 'Sobre Nosotros'
        }
      },
      {
        path: 'favoritos',
        loadComponent: () => import('./favorites/favorites.component').then(m => m.FavoritesComponent),
        data: {
          title: 'Mis Favoritos | PrecioRadar',
          description: 'Tus productos guardados de Amazon con envío a Argentina.',
          robots: 'noindex, nofollow',
          breadcrumb: 'Favoritos'
        }
      },
    ]
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: LayoutComponent,
    children: [{
      path: '',
      loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent),
      data: {
        title: 'Página no encontrada | PrecioRadar',
        description: 'La página que buscás no existe.',
        robots: 'noindex, nofollow'
      }
    }]
  }
];
