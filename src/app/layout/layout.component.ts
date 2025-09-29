import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { ScrollTop } from 'primeng/scrolltop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet, ScrollTop],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  ngOnInit() {
  }

}
