import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStoreDialogComponent } from './app-store-dialog.component';

describe('AppStoreDialogComponent', () => {
  let component: AppStoreDialogComponent;
  let fixture: ComponentFixture<AppStoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppStoreDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppStoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
