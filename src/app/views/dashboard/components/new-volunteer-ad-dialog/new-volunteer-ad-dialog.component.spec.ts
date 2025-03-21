import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVolunteerAdDialogComponent } from './new-volunteer-ad-dialog.component';

describe('NewVolunteerAdDialogComponent', () => {
  let component: NewVolunteerAdDialogComponent;
  let fixture: ComponentFixture<NewVolunteerAdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewVolunteerAdDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewVolunteerAdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
