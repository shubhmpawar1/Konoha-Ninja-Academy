import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Instructor,
  InstructorService,
  PaginatedResponse
} from '../../../core/services/instructor-service';
import {
  Observable,
  Subject,
  switchMap,
  startWith,
  map,
  catchError,
  of,
  tap
} from 'rxjs';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule
} from '@angular/forms';
import { InstructorsDelete } from '../instructors-delete/instructors-delete';
import { InstructorsDisable } from '../instructors-disable/instructors-disable';
import { InstructorsEdit } from '../instructors-edit/instructors-edit';
import { Notification } from '../../../core/services/notification';

@Component({
  selector: 'app-instructors-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InstructorsDelete,
    InstructorsDisable,
    InstructorsEdit
  ],
  templateUrl: './instructors-list.html',
  styleUrl: './instructors-list.css'
})
export class InstructorsList implements OnInit, OnChanges {
  @Input() reloadTrigger: any;

  $paginatedData!: Observable<PaginatedResponse>;
  $instructor!: Observable<Instructor[]>;

  private refresh$ = new Subject<void>();

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
  ) {}

  // -------------------- INIT --------------------

  ngOnInit(): void {
    this.buildDataStream();
  }

  ngOnChanges(): void {
    if (this.reloadTrigger) {
      this.refresh$.next();
    }
  }

  // -------------------- DATA STREAM --------------------

  private buildDataStream(): void {
    this.$paginatedData = this.refresh$.pipe(
      startWith(void 0),
      tap(() => {
        this.isLoading = true;
        this.error = null;
      }),
      switchMap(() =>
        this.instructorService
          .getPaginatedInstructors(this.currentPage, this.pageSize)
          .pipe(
            catchError(err => {
              console.error('Load error:', err);
              this.error = 'Failed to load instructors';
              return of({
                data: [],
                pagination: {
                  page: 1,
                  limit: this.pageSize,
                  total: 0,
                  totalPages: 0,
                  hasNext: false,
                  hasPrev: false
                }
              });
            })
          )
      ),
      tap(() => (this.isLoading = false))
    );

    this.$instructor = this.$paginatedData.pipe(
      map(res => res.data)
    );
  }

  // -------------------- PAGINATION --------------------

  onPageChange(page: number): void {
    this.currentPage = page;
    this.refresh$.next();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.refresh$.next();
  }

  // -------------------- EDIT --------------------

  openEdit(instructor: Instructor): void {
    this.selectedInstructor = instructor;
    this.showEditModal = true;

    this.editForm = this.fb.group({
      name: [instructor.name, [Validators.required, Validators.minLength(2)]],
      jutsu_type: [instructor.jutsu_type, Validators.required],
      chakra_type: [instructor.chakra_type],
      signature_jutsu: [instructor.signature_jutsu],
      summon_type: [instructor.summon_type],
      is_active: [instructor.is_active]
    });
  }

  onEditSave(): void {
    if (!this.selectedInstructor || this.editForm.invalid) return;

    this.instructorService
      .updateInstructor(this.selectedInstructor.id!, this.editForm.value)
      .subscribe({
        next: () => {
          this.notify.success('Instructor updated successfully');
          this.closeEditModal();
          this.refresh$.next();
        },
        error: () => {
          this.notify.error('Failed to update instructor');
          this.closeEditModal();
        }
      });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedInstructor = null;
  }

  // -------------------- DELETE --------------------

  openDelete(instructor: Instructor): void {
    this.selectedInstructor = instructor;
    this.showDeleteModal = true;
  }

  onDeleteConfirmed(): void {
    if (!this.selectedInstructor) return;

    this.instructorService
      .deleteInstructor(this.selectedInstructor.id!)
      .subscribe({
        next: () => {
          this.notify.success('Instructor deleted successfully updated');
          this.closeDeleteModal();
          this.refresh$.next(); // 🔥 refresh table
        },
        error: err => {
          if (err.status === 409) {
            this.notify.error(
              'Cannot delete instructor because students are assigned'
            );
          } else {
            this.notify.error('Failed to delete instructor');
          }
          this.closeDeleteModal();
        }
      });
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedInstructor = null;
  }

  // -------------------- DISABLE / ENABLE --------------------

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

    action$.subscribe({
      next: () => {
        this.notify.success(
          instructor.is_active
            ? 'Instructor disabled successfully'
            : 'Instructor enabled successfully'
        );
        this.closeDisableModal();
        this.refresh$.next(); // 🔥 refresh table
      },
      error: () => {
        this.notify.error('Failed to update instructor status');
        this.closeDisableModal();
      }
    });
  }

  closeDisableModal(): void {
    this.showDisableModal = false;
    this.selectedInstructor = null;
  }
}
