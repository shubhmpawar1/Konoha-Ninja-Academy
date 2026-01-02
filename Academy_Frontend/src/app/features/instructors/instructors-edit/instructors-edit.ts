import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup , ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-instructors-edit',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './instructors-edit.html',
  styleUrl: './instructors-edit.css',
})
export class InstructorsEdit {
  @Input() form!: FormGroup;

  @Output() save = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onSave(): void {
    this.save.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
