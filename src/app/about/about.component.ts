import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-about',
  imports: [CardModule, DividerModule, ButtonModule, RouterModule, AnimateOnScrollModule, Breadcrumb],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  protected readonly homeItem: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  protected readonly breadcrumbItems: MenuItem[] = [
    { label: 'Sobre Nosotros', icon: 'pi pi-users' }
  ];
}
