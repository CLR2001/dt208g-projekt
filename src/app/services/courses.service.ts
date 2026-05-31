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
      const courseCodesArray = Array.from(this.savedCourseCodes());
      localStorage.setItem('savedCourses', JSON.stringify(courseCodesArray));
    });
  }

  private http = inject(HttpClient);

  /* --------------------------------- Signals -------------------------------- */
  allCourses = toSignal(
    this.http.get<Course[]>('/miun_courses.json'),
    {initialValue: [] as Course[]}
  );

  currentPage = signal<number>(1);
  itemsPerPage = 50;

  searchInput = signal('');
  selectedSubject = signal<string>('Alla');
  sortConfig = signal<SortConfig>({
    column: 'courseName',
    direction: 'asc'
  });
  
  private filteredAndSortedCourses = computed(() => {
    let courses = this.allCourses();

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
    return [...courses].sort((a, b) => {
      let result = 0;

      if (column === 'points') {
        result = a.points - b.points;
      } else {
        const valueA = a[column]
        const valueB = b[column]
        result = valueA.localeCompare(valueB, 'sv');
      }
      return direction === 'asc' ? result : -result;
    });
  });
  
  displayedCourses = computed(() => {
    const courses = this.filteredAndSortedCourses();

    const page = this.currentPage();
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return courses.slice(startIndex, endIndex);
  });
  
  savedCourseCodes = signal<Set<string>>(this.getSavedCourses());

  savedCourses = computed(() => {
    const savedCodes = this.savedCourseCodes();
    return this.allCourses().filter(course => savedCodes.has(course.courseCode));
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredAndSortedCourses().length / this.itemsPerPage) || 1;
  });

  /* --------------------------- Filtering & Sorting -------------------------- */
  setSearchInput(input: string): void {
    this.searchInput.set(input);
    this.currentPage.set(1);
  }

  setSubject(subject: string): void {
    this.selectedSubject.set(subject);
    this.currentPage.set(1);
  }

  setSortConfig(column: SortConfig['column']): void {
    this.sortConfig.update(config => ({
      column,
      direction: config.column === column && config.direction === 'asc' ? 'desc' : 'asc'
    }));  
    this.currentPage.set(1);
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

  addCourse(courseCode: Course['courseCode']) {
    this.savedCourseCodes.update(set => {
      const updatedSet = new Set(set);
      updatedSet.add(courseCode);
      return updatedSet;
    });
  }

  removeCourse(courseCode: Course['courseCode']) {
    this.savedCourseCodes.update(set => {
      const updatedSet = new Set(set);
      updatedSet.delete(courseCode);
      return updatedSet;
    });
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  previousPage(): void {
    this.currentPage.update(page => Math.max(1, page - 1));
  }

  setPage(event: Event): void {
    const input = event.target as HTMLInputElement;

    const page = Number(input.value);
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}