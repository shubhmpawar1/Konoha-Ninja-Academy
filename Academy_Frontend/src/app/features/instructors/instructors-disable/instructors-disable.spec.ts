import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorsDisable } from './instructors-disable';

describe('InstructorsDisable', () => {
  let component: InstructorsDisable;
  let fixture: ComponentFixture<InstructorsDisable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorsDisable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorsDisable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
