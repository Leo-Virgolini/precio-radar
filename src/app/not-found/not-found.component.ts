import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-column align-items-center justify-content-center text-center px-4" style="min-height: 65vh;">
      <!-- Animated radar illustration -->
      <div class="not-found-radar mb-4 animate-stagger-1">
        <div class="radar-circle"></div>
        <div class="radar-circle radar-circle-2"></div>
        <div class="radar-sweep"></div>
        <span class="radar-icon">?</span>
      </div>

      <h1 class="not-found-title mb-2 animate-stagger-2">404</h1>
      <h2 class="text-xl font-semibold mb-2 animate-stagger-3" style="color: var(--p-text-color);">Página no encontrada</h2>
      <p class="text-color-secondary mb-5 animate-stagger-4" style="max-width: 28rem; line-height: 1.6;">
        Nuestro radar no pudo detectar esta página. Es posible que haya sido movida o que la dirección sea incorrecta.
      </p>

      <div class="flex flex-column sm:flex-row gap-3 align-items-center animate-stagger-5">
        <p-button label="Volver al inicio" icon="pi pi-home" routerLink="/" />
        <p-button label="Guía de compra" icon="pi pi-book" routerLink="/guia-de-compra" severity="secondary" [outlined]="true" />
      </div>
    </section>
  `,
  styles: [`
    .not-found-radar {
      position: relative;
      width: 140px;
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .radar-circle {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid var(--p-primary-200);
      opacity: 0.6;
    }

    .radar-circle-2 {
      inset: 20px;
      border-color: var(--p-primary-300);
      opacity: 0.8;
    }

    .radar-sweep {
      position: absolute;
      width: 50%;
      height: 50%;
      top: 0;
      left: 50%;
      transform-origin: bottom left;
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.25), transparent);
      border-radius: 0 100% 0 0;
      animation: sweep 3s linear infinite;
    }

    .radar-icon {
      position: relative;
      z-index: 1;
      font-size: 3rem;
      font-weight: 800;
      color: var(--p-primary-500);
      font-family: var(--font-heading);
    }

    .not-found-title {
      font-size: 5rem;
      font-weight: 900;
      font-family: var(--font-heading);
      background: linear-gradient(135deg, var(--p-primary-500), var(--p-primary-300));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }

    @keyframes sweep {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class NotFoundComponent {}
