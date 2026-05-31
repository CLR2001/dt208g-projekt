import { Component } from '@angular/core';
import { CourseTable } from '../../components/course-table/course-table';

@Component({
  selector: 'app-home',
  imports: [CourseTable],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
