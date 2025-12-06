// src/app/components/projects/projects.component.ts
import { Component } from '@angular/core';
import { Project } from '../../models/project.model';
import { PROJECTS } from '../../constants/projects';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-projects',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})
export class Projects {
  projects: Project[] = PROJECTS;

  constructor(
    private router: Router
  ){}

  openProject(project: Project): void {
    window.open(project.link, '_blank', 'noopener,noreferrer');
    console.log('Projeto clicado:', project);
  }

  openDribbble(): void {
    window.open('https://dribbble.com', '_blank');
  }

  viewProject(projectId: string): void {
    this.router.navigate(['/project', projectId]);
  }
}