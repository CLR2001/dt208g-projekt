import { Component, Input } from '@angular/core';
import { Course } from '../../interfaces/course.interface';

@Component({
  selector: 'app-course-table',
  standalone: true,
  imports: [],
  templateUrl: './course-table.html',
  styleUrl: './course-table.scss',
})
export class CourseTable {
  @Input() courses: Course[] = [];
  @Input() type: 'add' | 'remove' = 'add';
  @Input() buttonText = 'Lägg till';

  onButtonClick(courseCode: string): void {
    if (this.type === 'add') {
      
    } else {

    }
  }
}