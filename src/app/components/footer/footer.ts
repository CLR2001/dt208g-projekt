import { Component } from '@angular/core';
import { ThemeButton } from '../theme-button/theme-button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ThemeButton],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {}
