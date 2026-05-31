import { Component, inject } from '@angular/core';
import { CourseService } from '../../../services/courses.service';
import { CourseTable } from '../../../components/course-table/course-table';

@Component({
  selector: 'app-ramschema',
  imports: [CourseTable],
  templateUrl: './ramschema.html',
  styleUrl: './ramschema.scss',
})
export class Ramschema {
  courseService = inject(CourseService);

  constructor() {
    this.courseService.currentView.set('ramschema');
    this.courseService.currentPage.set(1);
  }
}
