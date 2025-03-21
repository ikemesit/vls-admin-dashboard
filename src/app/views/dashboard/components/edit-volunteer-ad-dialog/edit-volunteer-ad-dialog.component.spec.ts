import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVolunteerAdDialogComponent } from './edit-volunteer-ad-dialog.component';

describe('EditVolunteerAdDialogComponent', () => {
  let component: EditVolunteerAdDialogComponent;
  let fixture: ComponentFixture<EditVolunteerAdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVolunteerAdDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVolunteerAdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
