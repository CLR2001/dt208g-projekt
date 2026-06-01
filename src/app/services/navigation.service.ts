import { effect, Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class NavigationService {
  isMenuOpen = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.toggleInert(this.isMenuOpen());
    })
  }


  init(): void {
    const header = document.querySelector('header');
    if (!header) return;

    this.updateVariables(header);

    window.addEventListener('resize', () => {
      this.updateVariables(header);
      
      if (window.innerWidth > 899 && this.isMenuOpen()) {
        this.closeMenu();
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  private updateVariables(header: HTMLElement): void {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`); 
  } 

  private toggleInert(toInert: boolean): void {
    const elements = document.querySelectorAll<HTMLElement>('body > :not(app-root, header)');

    elements.forEach(element => {
      element.inert = toInert;
    });
  }
}