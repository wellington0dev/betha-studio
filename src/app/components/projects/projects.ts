// src/app/components/projects/projects.component.ts
import { Component } from '@angular/core';
import { Project } from '../../models/project.model';
import { PROJECTS } from '../../constants/projects';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports:[
    CommonModule
  ],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})
export class Projects {
  projects: Project[] = PROJECTS;

  openProject(project: Project): void {
    // Aqui você pode implementar a lógica para abrir o projeto
    // Por exemplo: navegar para detalhes, abrir modal, etc.
    console.log('Projeto clicado:', project);
  }

  openDribbble(): void {
    // Lógica para abrir link do Dribbble
    window.open('https://dribbble.com', '_blank');
  }
}