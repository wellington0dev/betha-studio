import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSection } from './client-section';

describe('ClientSection', () => {
  let component: ClientSection;
  let fixture: ComponentFixture<ClientSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
