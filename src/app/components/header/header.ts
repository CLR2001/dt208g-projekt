import { Component, inject } from '@angular/core';
import { Icons } from '../icons/icons';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Icons, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected navigationService = inject(NavigationService);

  ngOnInit(): void {
    this.navigationService.init();
  }
}
