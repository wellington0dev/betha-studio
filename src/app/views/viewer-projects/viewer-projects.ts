// src/app/pages/view-project/view-project.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Project } from '../../models/project.model';
import { PROJECTS } from '../../constants/projects';

@Component({
  selector: 'app-viewer-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './viewer-projects.html',
  styleUrls: [
    './viewer-projects.scss'
  ]
})
export class ViewerProject implements OnInit {
  project?: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      this.project = PROJECTS.find(p => p.id === projectId);
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}