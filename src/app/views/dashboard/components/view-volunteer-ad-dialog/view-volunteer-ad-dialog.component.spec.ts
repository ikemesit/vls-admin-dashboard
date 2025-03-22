import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVolunteerAdDialogComponent } from './view-volunteer-ad-dialog.component';

describe('ViewVolunteerAdDialogComponent', () => {
  let component: ViewVolunteerAdDialogComponent;
  let fixture: ComponentFixture<ViewVolunteerAdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewVolunteerAdDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVolunteerAdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
