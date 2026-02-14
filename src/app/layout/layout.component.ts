import { Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { ScrollTop } from 'primeng/scrolltop';


@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, FooterComponent, RouterOutlet, ScrollTop],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private originalTitle = '';
  private readonly hiddenTitle = '\u{1F440} \u00A1Las ofertas te esperan! - PrecioRadar';

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.originalTitle = this.document.title;

    const onVisibilityChange = () => {
      this.document.title = this.document.hidden ? this.hiddenTitle : this.originalTitle;
    };

    this.document.addEventListener('visibilitychange', onVisibilityChange);
    this.destroyRef.onDestroy(() => {
      this.document.removeEventListener('visibilitychange', onVisibilityChange);
    });
  }
}
