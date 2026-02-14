import { Component, ChangeDetectionStrategy, inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { RouterModule } from '@angular/router';
import { TimelineModule } from 'primeng/timeline';
import { StepsModule } from 'primeng/steps';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-amazon-guide',
  imports: [
    CardModule,
    TagModule,
    DividerModule,
    ButtonModule,
    BadgeModule,
    RouterModule,
    TimelineModule,
    StepsModule,
    ChipModule,
    AvatarModule,
    MessageModule,
    PanelModule,
    AnimateOnScrollModule
  ],
  templateUrl: './amazon-guide.component.html',
  styleUrl: './amazon-guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmazonGuideComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private faqScriptElement: HTMLScriptElement | null = null;

  protected readonly currentDate = new Date().toLocaleDateString('es-AR');

  protected readonly tableOfContents = [
    { id: 'introduccion', label: 'Introducción' },
    { id: 'paso-a-paso', label: 'Paso a Paso para Comprar' },
    { id: 'restricciones', label: 'Restricciones y Consideraciones' },
    { id: 'impuestos', label: 'Impuestos y Tarifas' },
    { id: 'consejos', label: 'Consejos para Ahorrar' },
    { id: 'ofertas', label: 'Ofertas Exclusivas' },
    { id: 'faq', label: 'Preguntas Frecuentes' },
    { id: 'conclusion', label: 'Conclusión' }
  ];

  protected readonly steps = [
    {
      number: 1,
      title: 'Crear tu cuenta en Amazon',
      description: 'Regístrate en Amazon.com o Amazon.es y configura tu dirección de envío en Argentina',
      details: [
        'Ve a Amazon y haz clic en "Account & Lists" (USA) o "Cuenta y listas" (España)',
        'Selecciona "Create your Amazon account" o "Crear cuenta"',
        'Completa el formulario con tus datos',
        'Configura tu dirección de envío en Argentina'
      ],
      links: [
        { label: 'Amazon USA', url: 'https://www.amazon.com', icon: 'pi pi-external-link' },
        { label: 'Amazon España', url: 'https://www.amazon.es', icon: 'pi pi-external-link' }
      ],
      icon: 'pi pi-user-plus',
      status: 'completed'
    },
    {
      number: 2,
      title: 'Identificar productos elegibles',
      description: 'Busca productos con envío disponible a Argentina. Las condiciones varían según la tienda.',
      details: [
        'Amazon USA: Envío gratis en pedidos de $99 USD o más en productos seleccionados',
        'Amazon España: Envío pago (€21 por envío + €11 por kg con AmazonGlobal Express)',
        'Amazon España solo envía libros, CDs, DVDs y videojuegos por envío Express (€20 + €9/kg)',
        'Revisa los detalles de envío de cada producto antes de comprar'
      ],
      icon: 'pi pi-search',
      status: 'completed'
    },
    {
      number: 3,
      title: 'Agregar tu método de pago',
      description: 'Configura tu tarjeta de crédito o débito',
      details: [
        'Ve a "Your Account" > "Payment options"',
        'Agrega tu tarjeta de crédito o débito',
        'Verifica que esté habilitada para compras internacionales',
        'Considera usar tarjeta de crédito para pagar con dólares propios'
      ],
      icon: 'pi pi-credit-card',
      status: 'completed'
    }
  ];

  protected readonly timelineEvents = [
    {
      status: 'completed',
      date: 'Paso 1',
      title: 'Crear cuenta',
      description: 'Regístrate en Amazon.com',
      icon: 'pi pi-user-plus'
    },
    {
      status: 'completed',
      date: 'Paso 2',
      title: 'Buscar productos',
      description: 'Encuentra productos elegibles',
      icon: 'pi pi-search'
    },
    {
      status: 'completed',
      date: 'Paso 3',
      title: 'Configurar pago',
      description: 'Agrega tu método de pago',
      icon: 'pi pi-credit-card'
    },
    {
      status: 'completed',
      date: 'Paso 4',
      title: 'Realizar compra',
      description: 'Confirma tu pedido',
      icon: 'pi pi-shopping-cart'
    }
  ];

  protected readonly restrictions = [
    {
      title: 'Unidades máximas',
      value: 'No más de 3 unidades iguales por envío',
      icon: 'pi pi-box'
    },
    {
      title: 'Valor máximo',
      value: 'Hasta $3,000 USD por envío (sin impuestos)',
      icon: 'pi pi-dollar'
    },
    {
      title: 'Peso máximo',
      value: '50 kg por paquete',
      icon: 'pi pi-box'
    },
    {
      title: 'Cantidad anual',
      value: 'Hasta 5 envíos anuales bajo el Régimen P',
      icon: 'pi pi-calendar'
    }
  ];

  protected readonly tips = [
    {
      title: 'Aprovecha el envío gratis de Amazon USA',
      description: 'Combina productos que califiquen para envío gratis en pedidos superiores a $99 USD. Amazon España no ofrece envío gratis a Argentina.',
      icon: 'pi pi-shopping-cart',
      color: 'success'
    },
    {
      title: 'Usa tarjeta de crédito',
      description: 'Permite pagar con dólares propios (dólar MEP), más económicos que el dólar tarjeta',
      icon: 'pi pi-credit-card',
      color: 'info'
    },
    {
      title: 'Evita envíos divididos',
      description: 'Comprar de diferentes tiendas puede consumir más de tus 5 envíos permitidos',
      icon: 'pi pi-exclamation-triangle',
      color: 'warn'
    },
    {
      title: 'Agrupa tus compras',
      description: 'Junta varios productos en un solo pedido para superar los $99 USD y obtener envío gratis',
      icon: 'pi pi-tags',
      color: 'help'
    }
  ];

  protected readonly faqItems = [
    {
      question: '¿Qué pasa si Amazon cobra más impuestos de los necesarios?',
      answer: 'Amazon devuelve el excedente automáticamente al mismo método de pago. No necesitas hacer nada adicional.'
    },
    {
      question: '¿Puedo combinar productos de diferentes categorías en un envío?',
      answer: 'Sí, pero el envío se categorizará como Régimen P, que tiene un límite de 5 envíos anuales.'
    },
    {
      question: '¿Cuánto tiempo tarda en llegar mi pedido?',
      answer: 'Los envíos internacionales suelen tardar entre 7 a 15 días hábiles, dependiendo del producto y la ubicación.'
    },
    {
      question: '¿Puedo rastrear mi pedido?',
      answer: 'Sí, Amazon te proporciona un número de seguimiento una vez que el paquete es enviado.'
    },
    {
      question: '¿Qué productos no se pueden enviar a Argentina?',
      answer: 'Algunos productos como líquidos, productos químicos, alimentos perecederos y ciertos electrónicos pueden tener restricciones.'
    }
  ];

  ngOnInit(): void {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': this.faqItems.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    };

    this.faqScriptElement = this.document.createElement('script');
    this.faqScriptElement.type = 'application/ld+json';
    this.faqScriptElement.id = 'faq-jsonld';
    this.faqScriptElement.textContent = JSON.stringify(faqSchema);
    this.document.head.appendChild(this.faqScriptElement);
  }

  ngOnDestroy(): void {
    if (this.faqScriptElement) {
      this.faqScriptElement.remove();
      this.faqScriptElement = null;
    }
  }

  protected openLink(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  protected scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
