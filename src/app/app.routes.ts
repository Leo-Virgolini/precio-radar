import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AmazonTabsComponent } from './amazon-tabs/amazon-tabs.component';
import { AmazonGuideComponent } from './amazon-guide/amazon-guide.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: AmazonTabsComponent },
      { path: 'guia-amazon', component: AmazonGuideComponent },
      { path: 'privacidad', component: PrivacyPolicyComponent },
      { path: 'sobre-nosotros', component: AboutComponent },
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

