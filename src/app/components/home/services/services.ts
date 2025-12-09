// src/app/components/services/services.component.ts
import { Component } from '@angular/core';
import { Service } from '../../../models/service.model';
import { SERVICES } from '../../../constants/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  imports: [
    CommonModule
  ],
  templateUrl: './services.html',
  styleUrls: ['./services.scss']
})
export class Services {
  services: {
    title: string;
    description: string;
    icon: string;
    color: string;
  }[] = SERVICES;

  getBackgroundColor(colorClass: string): string {
    // Converte classe de texto para background
    return colorClass.replace('text-', 'bg-');
  }
}