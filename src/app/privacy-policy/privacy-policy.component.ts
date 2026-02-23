/*  */import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RouterModule } from '@angular/router';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-privacy-policy',
  imports: [CardModule, DividerModule, RouterModule, Breadcrumb],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  protected readonly lastUpdated = new Date().toLocaleDateString('es-AR');

  protected readonly homeItem: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  protected readonly breadcrumbItems: MenuItem[] = [
    { label: 'Política de Privacidad', icon: 'pi pi-shield' }
  ];
}
