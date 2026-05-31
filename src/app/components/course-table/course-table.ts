import { Component, Input, inject } from '@angular/core';
import { Course } from '../../interfaces/course.interface';
import { CourseService } from '../../services/courses.service';
import { Icons } from '../icons/icons';

@Component({
  selector: 'app-course-table',
  standalone: true,
  imports: [Icons],
  templateUrl: './course-table.html',
  styleUrl: './course-table.scss',
})
export class CourseTable {
  @Input() courses: Course[] = [];
  @Input() type: 'add' | 'remove' = 'add';
  @Input() buttonText = 'Lägg till';

  courseService = inject(CourseService)

  onButtonClick(courseCode: string): void {
    if (this.type === 'add') {
      this.courseService.addCourse(courseCode);
    } else {
      this.courseService.removeCourse(courseCode);
    }
  }
}