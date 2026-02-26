import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoFormComponent } from './empleado-form.component';

describe('EmpleadoFormComponent', () => {
  let component: EmpleadoFormComponent;
  let fixture: ComponentFixture<EmpleadoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpleadoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
