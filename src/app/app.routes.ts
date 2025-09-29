import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AmazonTabsComponent } from './amazon-tabs/amazon-tabs.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: AmazonTabsComponent },
    ]
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

