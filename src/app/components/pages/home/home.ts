import { Component, DestroyRef, inject } from '@angular/core';
import { CourseTable } from '../../../components/course-table/course-table';
import { CourseService } from '../../../services/courses.service';

@Component({
  selector: 'app-home',
  imports: [CourseTable],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  courseService = inject(CourseService);

  constructor() {
    this.courseService.currentView.set('home');
    this.courseService.currentPage.set(1);
    this.courseService.setSearchInput('');
    this.courseService.setSubject('Alla');
  }
}
