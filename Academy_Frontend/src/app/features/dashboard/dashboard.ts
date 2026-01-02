import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { StudentService, StudentCounts } from '../../core/services/student-service';
import { InstructorService, InstructorCounts } from '../../core/services/instructor-service';
import { RouterLink } from "@angular/router";



@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {


  // studentCounts$!: Observable<StudentCounts>;
  instructorCounts$!: Observable<InstructorCounts>;

  constructor(private studentService: StudentService, private instructorService: InstructorService) { }

  ngOnInit(): void {
    // this.studentCounts$ = this.studentService.getStudentCounts();
    this.instructorCounts$ = this.instructorService.getInstructorCounts();
  }
}
