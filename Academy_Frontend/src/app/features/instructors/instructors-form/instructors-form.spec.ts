import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorsForm } from './instructors-form';

describe('InstructorsForm', () => {
  let component: InstructorsForm;
  let fixture: ComponentFixture<InstructorsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
