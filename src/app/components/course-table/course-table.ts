import { Component, input, inject } from '@angular/core';
import { Course } from '../../interfaces/course.interface';
import { CourseService } from '../../services/courses.service';
import { Icons } from '../icons/icons';
import { RamschemaService } from '../../services/saved-courses.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-table',
  standalone: true,
  imports: [Icons, FormsModule],
  templateUrl: './course-table.html',
  styleUrl: './course-table.scss',
})
export class CourseTable {
  courses = input<Course[]>([]); 
  type = input<'add' | 'remove'>('add');
  buttonText = input<string>('Lägg till');

  courseService = inject(CourseService);
  ramschemaService = inject(RamschemaService);

  onButtonClick(courseCode: string): void {
    if (this.type() === 'add') {
      this.ramschemaService.addCourse(courseCode);
    } else {
      this.ramschemaService.removeCourse(courseCode);
    }
  }
}