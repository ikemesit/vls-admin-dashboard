import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCampaignDialogComponent } from './view-campaign-dialog.component';

describe('ViewCampaignDialogComponent', () => {
  let component: ViewCampaignDialogComponent;
  let fixture: ComponentFixture<ViewCampaignDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCampaignDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCampaignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
