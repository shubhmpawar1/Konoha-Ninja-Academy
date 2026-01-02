import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InstructorService } from '../../../core/services/instructor-service';

@Component({
  selector: 'app-instructors-delete',
  imports: [],
  templateUrl: './instructors-delete.html',
  styleUrl: './instructors-delete.css',
})
export class InstructorsDelete {
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
