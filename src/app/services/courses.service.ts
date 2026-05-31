import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Course } from "../interfaces/course.interface";
import { SortConfig } from "../interfaces/sort-config.interface";
import { RamschemaService } from "./saved-courses.service";


@Injectable({
  providedIn: 'root'
})

export class CourseService {
  private http = inject(HttpClient);
  ramschemaService = inject(RamschemaService);

  /* --------------------------------- Signals -------------------------------- */
  allCourses = toSignal(
    this.http.get<Course[]>('/miun_courses.json'),
    {initialValue: [] as Course[]}
  );

  allSubjects = computed(() => {
     const subjects = this.allCourses().map(course => course.subject);
     return [...new Set(subjects)];
  });

  currentView = signal<'home' | 'ramschema'>('home');
  currentPage = signal<number>(1);
  itemsPerPage = 50;

  searchInput = signal('');
  selectedSubject = signal<string>('Alla');
  sortConfig = signal<SortConfig>({
    column: 'courseName',
    direction: 'asc'
  });
  
  filteredAndSortedCourses = computed(() => {
    let courses = this.currentView() === 'home' 
      ? this.allCourses() 
      : this.savedCourses();

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

  totalPages = computed(() => {
    return Math.ceil(this.filteredAndSortedCourses().length / this.itemsPerPage) || 1;
  });

  savedCourses = computed(() => {
    const savedCodes = this.ramschemaService.savedCourseCodes();
    return this.allCourses().filter(course => savedCodes.has(course.courseCode));
  });

  totalSavedPoints = computed(() => {
    const totalPoints = this.savedCourses().reduce((sum, course) => sum + course.points, 0);
    return totalPoints;
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

  /* ------------------------------- Pagination ------------------------------- */
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