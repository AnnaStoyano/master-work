import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFindComponent } from './not-find.component';

describe('NotFindComponent', () => {
  let component: NotFindComponent;
  let fixture: ComponentFixture<NotFindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotFindComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
