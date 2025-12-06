import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerProjects } from './viewer-projects';

describe('ViewerProjects', () => {
  let component: ViewerProjects;
  let fixture: ComponentFixture<ViewerProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewerProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
