
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-instructors-disable',
  imports:[CommonModule],
  templateUrl: './instructors-disable.html',
  styleUrl: './instructors-disable.css',
})
export class InstructorsDisable {
  @Input() isActive!: boolean;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
