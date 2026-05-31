import { effect, Injectable, signal } from "@angular/core";
import { Course } from "../interfaces/course.interface";


@Injectable({
  providedIn: 'root'
})

export class RamschemaService {
  constructor() {
    effect(() => {
      const courseCodesArray = Array.from(this.savedCourseCodes());
      localStorage.setItem('savedCourses', JSON.stringify(courseCodesArray));
    });
  }

  /* --------------------------------- Signals -------------------------------- */
  savedCourseCodes = signal<Set<string>>(this.getSavedCoursesFromStorage());


  /* ------------------------------ Functionality ----------------------------- */
  private getSavedCoursesFromStorage(): Set<string> {
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
}