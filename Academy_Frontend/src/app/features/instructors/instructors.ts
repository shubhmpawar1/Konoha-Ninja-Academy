import { Component} from '@angular/core';
import { InstructorsList } from './instructors-list/instructors-list';
import { InstructorsForm } from "./instructors-form/instructors-form";

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [InstructorsList, InstructorsForm],
  templateUrl: './instructors.html',
  styleUrls: ['./instructors.css'],
})
export class Instructors {

  reloadCounter = 0;
  constructor() { }

}
