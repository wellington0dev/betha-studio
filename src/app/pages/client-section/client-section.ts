import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { SuportChat } from '../../components/clients/suport-chat/suport-chat';
import { ClientSubscriptions } from '../../components/clients/client-subscriptions/client-subscriptions';
import { ClientDashboard } from '../../components/clients/client-dashboard/client-dashboard'; // Crie este componente

@Component({
  selector: 'app-client-section',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    Footer,
    SuportChat,
    ClientSubscriptions,
    ClientDashboard // Adicione este
  ],
  templateUrl: './client-section.html',
  styleUrl: './client-section.scss',
})
export class ClientSection {
  activeComponent: 'dashboard' | 'subscriptions' | 'chat' = 'subscriptions';

  setActiveComponent(component: 'dashboard' | 'subscriptions' | 'chat'): void {
    this.activeComponent = component;
  }

  getComponentClass(component: string): string {
    return this.activeComponent === component ? 'active' : '';
  }
}