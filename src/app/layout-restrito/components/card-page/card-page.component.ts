import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-card-page',
  imports: [ButtonModule, NgClass, CommonModule],
  templateUrl: './card-page.component.html',
  styleUrl: './card-page.component.scss'
})
export class CardPageComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';

}
