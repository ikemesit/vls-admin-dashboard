import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCampaignDialogComponent } from './new-campaign-dialog.component';

describe('NewCampaignDialogComponent', () => {
  let component: NewCampaignDialogComponent;
  let fixture: ComponentFixture<NewCampaignDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCampaignDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewCampaignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
