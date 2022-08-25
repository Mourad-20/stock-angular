import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingtableComponent } from './loadingtable.component';

describe('LoadingtableComponent', () => {
  let component: LoadingtableComponent;
  let fixture: ComponentFixture<LoadingtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingtableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
