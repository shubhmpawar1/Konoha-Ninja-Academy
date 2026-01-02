import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorsEdit } from './instructors-edit';

describe('InstructorsEdit', () => {
  let component: InstructorsEdit;
  let fixture: ComponentFixture<InstructorsEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorsEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorsEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
