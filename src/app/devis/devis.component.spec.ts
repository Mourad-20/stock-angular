import { ComponentFixture, TestBed } from '@angular/core/testing';

import {DevisComponent } from './devis.component';

describe('VentComponent', () => {
  let component: DevisComponent;
  let fixture: ComponentFixture<DevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
