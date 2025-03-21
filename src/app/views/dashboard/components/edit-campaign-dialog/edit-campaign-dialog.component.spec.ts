import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCampaignDialogComponent } from './edit-campaign-dialog.component';

describe('EditCampaignDialogComponent', () => {
  let component: EditCampaignDialogComponent;
  let fixture: ComponentFixture<EditCampaignDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCampaignDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCampaignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
