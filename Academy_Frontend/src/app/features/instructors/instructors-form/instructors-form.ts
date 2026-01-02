import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InstructorService } from '../../../core/services/instructor-service';
import { Notification } from '../../../core/services/notification';

@Component({
  selector: 'app-instructors-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './instructors-form.html',
  styleUrls: ['./instructors-form.css'],
})
export class InstructorsForm {
  is_Add_Mode: boolean = false;
  instructorForm!: FormGroup;
  @Output() instructorAdded = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder, 
    private instructorService: InstructorService,
    private notify: Notification
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.instructorForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/), Validators.minLength(2)]],
      jutsu_type: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/), Validators.minLength(8)]],
      chakra_type: ['', [Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/), Validators.minLength(4)]],
      signature_jutsu: ['', [Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/), Validators.maxLength(60)]],
      summon_type: ['', [Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/), Validators.maxLength(30)]],
      is_active: [true],
    });
  }

  Add_Ins(): void {
    this.is_Add_Mode = true;
  }

  onSubmit(): void {
    if (this.instructorForm.invalid) return;

    const value = this.instructorForm.value;
    
    this.instructorService.addInstructor(value).subscribe({
      next: () => {
        this.notify.success('Instructor added successfully');
        this.is_Add_Mode = false;
        this.instructorAdded.emit();
        this.initializeForm();
      },
      error: (err) => {
        console.error('Error adding instructor:', err);
        this.notify.error('Failed to add instructor. Please try again.');
      }
    });
  }

  onCancel(): void {
    this.is_Add_Mode = false;
    this.initializeForm();
  }
}