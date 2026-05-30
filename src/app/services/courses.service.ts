import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Course } from "../interfaces/course.interface";
import { SortConfig } from "../interfaces/sort-config.interface";


@Injectable({
  providedIn: 'root'
})

export class CourseService {
  constructor() {
    effect(() => {
      const courseCodesArray = Array.from(this.addedCourseCodes());
      localStorage.setItem('savedCourses', JSON.stringify(courseCodesArray));
    });
  }

  private http = inject(HttpClient);

  allCourses = toSignal(
    this.http.get<Course[]>('/miun_courses.json'),
    {initialValue: [] as Course[]}
  );

  /* --------------------------- Filtering & Sorting -------------------------- */
  searchInput = signal('');
  selectedSubject = signal<string>('Alla');
  sortConfig = signal<SortConfig>({
    column: 'courseName',
    direction: 'asc'
  });
  
  displayedCourses = computed(() => {
    let courses = [...this.allCourses()];

    // Search filtering
    const search = this.searchInput().toLowerCase().trim();
    if (search) {
      courses = courses.filter(course => 
        course.courseName.toLowerCase().includes(search) || course.courseCode.toLowerCase().includes(search)
      );
    }

    // Subject filtering
    const subject = this.selectedSubject();
    if (subject !== 'Alla') {
      courses = courses.filter(course => course.subject === subject);
    }

    // Column sorting
    const { column, direction } = this.sortConfig();
    courses = courses.sort((a, b) => {
      let result = 0;

      if (column === 'points') {
        result = a.points - b.points;
      } else {
        const valueA = String(a[column])
        const valueB = String(b[column])
        result = valueA.localeCompare(valueB, 'sv');
      }

      return direction === 'asc' ? result : -result;
    });

    return courses;
  });

  setSearchInput(input: string): void {
    this.searchInput.set(input)
  }

  setSubject(subject: string): void {
    this.selectedSubject.set(subject)
  }

  setSortConfig(column: SortConfig['column']): void {
    this.sortConfig.update(config => ({
      column,
      direction: config.column === column && config.direction === 'asc' ? 'desc' : 'asc'
    }));  
  }

  /* ------------------------------ Functionality ----------------------------- */
  private getSavedCourses(): Set<string> {
    const savedCourseCodes = localStorage.getItem('savedCourses');

    if (savedCourseCodes) {
      const array = JSON.parse(savedCourseCodes);
      return new Set(array);
    }

    return new Set();
  }

  addedCourseCodes = signal<Set<string>>(this.getSavedCourses());



  addCourse(courseCode: Course['courseCode']) {

  }

  removeCourse(courseCode: Course['courseCode']) {

  }

}