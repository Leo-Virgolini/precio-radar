import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';

import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { CarouselModule } from 'primeng/carousel';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { AmazonApiService } from '../services/amazon-api.service';

@Component({
  selector: 'app-amazon-tabs',
  templateUrl: './amazon-tabs.component.html',
  styleUrl: './amazon-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TagModule,
    TabsModule,
    BadgeModule,
    ChipModule,
    CarouselModule,
    ProductSearchComponent
]
})
export class AmazonTabsComponent {

  private readonly amazonApi = inject(AmazonApiService);

  protected readonly activeTab = signal('0');

  protected readonly tabs = [
    {
      value: '0',
      label: 'Todas',
      region: 'ALL',
      description: 'Productos de Amazon USA y Amazon España con envío a Argentina'
    },
    {
      value: '1',
      label: 'Amazon USA',
      region: 'US',
      description: 'Productos de Amazon Estados Unidos con envío a Argentina'
    },
    {
      value: '2',
      label: 'Amazon España',
      region: 'ES',
      description: 'Productos de Amazon España con envío a Argentina'
    }
  ];

  protected readonly promoBanners = [
    {
      title: 'Prueba Amazon Prime España gratis 30 días',
      description: 'Envío gratis en millones de productos, acceso prioritario a ofertas y mucho más',
      icon: 'pi pi-box',
      url: 'https://www.amazon.es/pruebaprime?tag=precioradar-21',
      bannerClass: 'prime-banner',
      ctaClass: 'prime-cta',
      region: 'ES' as const
    },
    {
      title: 'Amazon Music Unlimited: 30 días gratis',
      description: '90 millones de canciones sin anuncios, modo offline y control por voz con Alexa. Después 9,99€/mes',
      icon: 'pi pi-headphones',
      url: 'https://www.amazon.es/gp/dmusic/promotions/AmazonMusicUnlimited?tag=precioradar-21',
      bannerClass: 'music-banner',
      ctaClass: 'music-cta',
      region: 'ES' as const
    },
    {
      title: 'Audible: audiolibros gratis 30 días',
      description: '+90.000 audiolibros y contenido exclusivo. Escuchá offline, con Alexa. Después 9,99€/mes',
      icon: 'pi pi-microphone',
      url: 'https://www.amazon.es/hz/audible/mlp/mdp/discovery?actionCode=AMSTM1450129210001&tag=precioradar-21',
      bannerClass: 'audible-banner',
      ctaClass: 'audible-cta',
      region: 'ES' as const
    },
    {
      title: 'Kindle Unlimited: leé gratis 30 días',
      description: 'Más de un millón de eBooks desde cualquier dispositivo. Después solo 9,99€/mes, cancelá cuando quieras',
      icon: 'pi pi-book',
      url: 'https://www.amazon.es/kindle-dbs/hz/signup?tag=precioradar-21',
      bannerClass: 'kindle-banner',
      ctaClass: 'kindle-cta',
      region: 'ES' as const
    }
  ];

  getCount(region: string): number {
    return this.amazonApi.getProductCount(region);
  }

}
