import { Component, inject } from '@angular/core';
import { CourseTable } from '../../components/course-table/course-table';
import { CourseService } from '../../services/courses.service';

@Component({
  selector: 'app-home',
  imports: [CourseTable],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  courseService = inject(CourseService);
}
