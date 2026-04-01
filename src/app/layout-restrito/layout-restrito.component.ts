import { Component } from '@angular/core';
import { TopbarComponent } from "../layouts/topbar/topbar.component";
import { SidebarComponent } from "../layouts/sidebar/sidebar.component";
import { FooterComponent } from "../layouts/footer/footer.component";
import { AppComponent } from "../app.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-layout-restrito',
  imports: [TopbarComponent, SidebarComponent, FooterComponent, RouterOutlet, CommonModule],
  templateUrl: './layout-restrito.component.html',
  styleUrl: './layout-restrito.component.scss'
})
export class LayoutRestritoComponent {
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
