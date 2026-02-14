import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { ProductSearchComponent } from '../product-search/product-search.component';

@Component({
  selector: 'app-amazon-tabs',
  templateUrl: './amazon-tabs.component.html',
  styleUrl: './amazon-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TagModule,
    TabsModule,
    ProductSearchComponent
]
})
export class AmazonTabsComponent {

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

}
