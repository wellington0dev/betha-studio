// src/app/components/projects/projects.component.ts
import { Component } from '@angular/core';
import { Project } from '../../models/project.model';
import { PROJECTS } from '../../constants/projects';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [
    CommonModule
  ],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})
export class Projects {
  projects: Project[] = PROJECTS;

  openProject(project: Project): void {
    window.open(project.link, '_blank', 'noopener,noreferrer');
    console.log('Projeto clicado:', project);
  }

  openDribbble(): void {
    // Lógica para abrir link do Dribbble
    window.open('https://dribbble.com', '_blank');
  }
}