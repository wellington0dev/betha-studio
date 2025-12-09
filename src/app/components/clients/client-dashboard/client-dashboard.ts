import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'client-dashboard.html',
  styleUrls: ['client-dashboard.scss']
})
export class ClientDashboard {
  // Lógica do dashboard pode ser adicionada aqui
}