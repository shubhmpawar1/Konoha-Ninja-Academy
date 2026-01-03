import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Instructor, InstructorService, PaginatedResponse } from '../../../core/services/instructor-service';
import { Observable, switchMap, tap, catchError, of, map, shareReplay, EMPTY } from 'rxjs';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { InstructorsDelete } from '../instructors-delete/instructors-delete';
import { InstructorsDisable } from '../instructors-disable/instructors-disable';
import { InstructorsEdit } from "../instructors-edit/instructors-edit";
import { Notification } from '../../../core/services/notification';

@Component({
  selector: 'app-instructors-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InstructorsDelete, InstructorsDisable, InstructorsEdit],
  templateUrl: './instructors-list.html',
  styleUrl: './instructors-list.css',
})
export class InstructorsList implements OnInit, OnChanges {
  @Input() reloadTrigger: any;
  $instructor!: Observable<Instructor[]>;
  $paginatedData!: Observable<PaginatedResponse>;
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20, 50];

  selectedInstructor: Instructor | null = null;
  editForm!: FormGroup;
  showDisableModal = false;
  showDeleteModal = false;
  showEditModal = false;
  isLoading = false;
  error: string | null = null;

  Math = Math;
 


  constructor(
    private instructorService: InstructorService,
    private fb: FormBuilder,
    public notify: Notification
  ) { }

  ngOnInit(): void {
    this.loadInstructors();
  }

  ngOnChanges(): void {
    if (this.reloadTrigger) {
      this.loadInstructors();
    }
  }

  loadInstructors(): void {
    this.isLoading = true;
    this.error = null;

    this.$paginatedData = this.instructorService.getPaginatedInstructors(this.currentPage, this.pageSize).pipe(
      tap(response => {
        console.log('Instructors loaded:', response);
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('Error loading instructors:', err);
        this.error = 'Failed to load instructors. Please try again.';
        this.isLoading = false;
        return of({ data: [], pagination: { page: 1, limit: 5, total: 0, totalPages: 0, hasNext: false, hasPrev: false } });
      }),
      shareReplay(1)
    );


    this.$instructor = this.$paginatedData.pipe(
      map(response => response.data)
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadInstructors();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadInstructors();
  }

  openEdit(instructor: Instructor): void {
    this.selectedInstructor = instructor;
    this.showEditModal = true;

    this.editForm = this.fb.group({
      name: [
        instructor.name,
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/),
          Validators.minLength(2)
        ]
      ],
      jutsu_type: [
        instructor.jutsu_type,
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/),
          Validators.minLength(8)
        ]
      ],
      chakra_type: [
        instructor.chakra_type,
        [
          Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/),
          Validators.minLength(4)
        ]
      ],
      signature_jutsu: [
        instructor.signature_jutsu,
        [
          Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/),
          Validators.maxLength(60)
        ]
      ],
      summon_type: [
        instructor.summon_type,
        [
          Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/),
          Validators.maxLength(30)
        ]
      ],
      is_active: [instructor.is_active],
    });
  }

onEditSave(): void {
  if (!this.selectedInstructor || this.editForm.invalid) return;

  const payload = {
    id: this.selectedInstructor.id!,
    ...this.editForm.value
  };

  this.instructorService
    .updateInstructor(payload.id, payload)
    .subscribe({
      next: () => {
        this.notify.success('Instructor updated successfully');
        this.closeEditModal();
        this.loadInstructors();
      },
      error: (err) => {
        console.error('Error updating instructor:', err);
        this.notify.error('Failed to update instructor. Please try again.');
        this.closeEditModal();
        this.loadInstructors();
      }
    });
}

  closeEditModal(): void {
    this.selectedInstructor = null;
    this.showEditModal = false;
  }

  openDelete(instructor: Instructor): void {
    this.selectedInstructor = instructor;
    this.showDeleteModal = true;
  }

onDeleteConfirmed(): void {
  if (!this.selectedInstructor) return;

  const instructorId = this.selectedInstructor.id!;
  const instructorName = this.selectedInstructor.name;

  // Close modal first
  this.closeDeleteModal();

  // Delete instructor
  this.instructorService.deleteInstructor(instructorId).subscribe({
    next: () => {
      this.notify.success(`Instructor "${instructorName}" deleted successfully`);

      // Update UI immediately by removing locally
      this.$instructor = this.$instructor.pipe(
        map(list => list.filter(i => i.id !== instructorId))
      );

      // Then fetch fresh paginated data from backend to stay in sync
      this.instructorService.getPaginatedInstructors(this.currentPage, this.pageSize)
        .subscribe(response => {
          this.$paginatedData = of(response);   // replace Observable
          this.$instructor = of(response.data); // replace Observable again to trigger async pipe
        });
    },
    error: (err) => {
      if (err.status === 409) {
        this.notify.error(`Cannot delete instructor "${instructorName}" because students are assigned.`);
      } else {
        this.notify.error(`Failed to delete instructor "${instructorName}".`);
      }

      // Fetch fresh list anyway
      this.loadInstructors();
    }
  });

  this.selectedInstructor = null;
}



  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedInstructor = null;
  }

  openDisable(instructor: Instructor): void {
    this.selectedInstructor = instructor;
    this.showDisableModal = true;
  }

onDisableConfirmed(): void {
  if (!this.selectedInstructor) return;

  const instructor = this.selectedInstructor;
  const action$ = instructor.is_active
    ? this.instructorService.disableInstructor(instructor.id!)
    : this.instructorService.enableInstructor(instructor.id!);

  action$.pipe(
    switchMap(() => this.instructorService.getPaginatedInstructors(this.currentPage, this.pageSize))
  ).subscribe({
    next: (response) => {
      this.$paginatedData = of(response).pipe(shareReplay(1));
      this.$instructor = this.$paginatedData.pipe(map(res => res.data));
      
     
      if (instructor.is_active) {
        this.notify.success('Instructor disabled successfully');
      } else {
        this.notify.success('Instructor enabled successfully');
      }
      
      this.closeDisableModal();
      this.loadInstructors();
    },
    error: (err) => {
      console.error('Error updating instructor status:', err);
      
      
      if (instructor.is_active) {
        this.notify.error('Failed to disable instructor. Please try again.');
      } else {
        this.notify.error('Failed to enable instructor. Please try again.');
      }
      
      this.closeDisableModal();
      this.loadInstructors();
    }
  });
}
  closeDisableModal(): void {
    this.showDisableModal = false;
    this.selectedInstructor = null;
  }
}