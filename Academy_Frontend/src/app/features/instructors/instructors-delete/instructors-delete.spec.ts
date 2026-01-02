import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorsDelete } from './instructors-delete';

describe('InstructorsDelete', () => {
  let component: InstructorsDelete;
  let fixture: ComponentFixture<InstructorsDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorsDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorsDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
