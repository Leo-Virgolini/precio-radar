import { Component } from '@angular/core';

import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { ProductSearchComponent } from '../product-search/product-search.component';

@Component({
  selector: 'app-amazon-tabs',
  templateUrl: './amazon-tabs.component.html',
  styleUrl: './amazon-tabs.component.scss',
  imports: [
    TagModule,
    TabsModule,
    ProductSearchComponent
]
})
export class AmazonTabsComponent {

  protected readonly tabs = [
    {
      value: '0',
      label: 'Amazon US',
      region: 'US',
      description: 'Productos de Amazon Estados Unidos con envío a Argentina'
    },
    {
      value: '1',
      label: 'Amazon España',
      region: 'ES',
      description: 'Productos de Amazon España con envío a Argentina'
    }
  ];

}
