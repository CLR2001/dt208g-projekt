import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icons',
  standalone: true,
  imports: [],
  templateUrl: './icons.html',
})
export class Icons {
  @Input() name!: string;
}
