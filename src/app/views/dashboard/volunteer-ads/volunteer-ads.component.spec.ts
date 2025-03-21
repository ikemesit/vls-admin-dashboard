import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerAdsComponent } from './volunteer-ads.component';

describe('VolunteerAdsComponent', () => {
  let component: VolunteerAdsComponent;
  let fixture: ComponentFixture<VolunteerAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolunteerAdsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
