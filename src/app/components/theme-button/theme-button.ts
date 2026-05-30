import { Component } from '@angular/core';
import { Icons } from '../icons/icons';

@Component({
  selector: 'app-theme-button',
  standalone: true,
  imports: [Icons],
  templateUrl: './theme-button.html',
})
export class ThemeButton {
  isDarkMode = false;

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = prefersDarkMode
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme() {
    const theme = this.isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.dataset['theme'] = theme;
  }
}
