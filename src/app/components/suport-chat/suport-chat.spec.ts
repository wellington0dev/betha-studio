import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuportChat } from './suport-chat';

describe('SuportChat', () => {
  let component: SuportChat;
  let fixture: ComponentFixture<SuportChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuportChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuportChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
