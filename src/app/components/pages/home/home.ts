import { Component, effect, inject } from '@angular/core';
import { CourseTable } from '../../../components/course-table/course-table';
import { CourseService } from '../../../services/courses.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CourseTable, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  courseService = inject(CourseService);

  constructor() {
    this.courseService.currentView.set('home');
    this.courseService.currentPage.set(1);
    this.courseService.searchInput.set('');
    this.courseService.selectedSubject.set('Alla');

    effect(() => {
      this.courseService.searchInput();
      this.courseService.selectedSubject();

      this.courseService.currentPage.set(1);
    });
  }
}
