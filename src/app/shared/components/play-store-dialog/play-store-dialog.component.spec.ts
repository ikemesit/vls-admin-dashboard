import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayStoreDialogComponent } from './play-store-dialog.component';

describe('PlayStoreDialogComponent', () => {
  let component: PlayStoreDialogComponent;
  let fixture: ComponentFixture<PlayStoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayStoreDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayStoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
