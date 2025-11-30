import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SubscriptionService, Subscription, SubscriptionRequest } from '../../services/subscription.service';
import { ChatService, Message } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { Subscription as RxSubscription } from 'rxjs';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.scss',
})
export class ClientDashboard implements OnInit, OnDestroy {
  activeTab = signal<'subscriptions' | 'chat'>('subscriptions');
  userName = signal('');
  
  // Dados de assinaturas
  subscriptions = signal<Subscription[]>([]);
  pendingRequests = signal<SubscriptionRequest[]>([]);
  
  // Dados do chat
  messages = signal<Message[]>([]);
  newMessage = signal('');
  isLoading = signal(false);

  private subscriptionsSubscription?: RxSubscription;
  private messagesSubscription?: RxSubscription;

  constructor(
    private auth: AuthService,
    private subscriptionService: SubscriptionService,
    private chatService: ChatService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.userName.set(this.auth.getUserName());
    await this.loadData();
    this.setupRealTimeListeners();
  }

  ngOnDestroy() {
    this.subscriptionsSubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
  }

  private async loadData() {
    this.isLoading.set(true);
    try {
      const [subscriptions, requests, messages] = await Promise.all([
        this.subscriptionService.getActiveSubscriptions(),
        this.subscriptionService.getPendingRequests(),
        this.chatService.getMessages()
      ]);

      this.subscriptions.set(subscriptions);
      this.pendingRequests.set(requests);
      this.messages.set(messages);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private setupRealTimeListeners() {
    // Escutar mudanças nas assinaturas
    this.subscriptionsSubscription = this.subscriptionService.getSubscriptionsRealTime()
      .subscribe((data: any) => {
        if (data) {
          this.subscriptions.set(Object.values(data));
        }
      });

    // Escutar novas mensagens
    this.messagesSubscription = this.chatService.getMessagesRealTime()
      .subscribe((data: any) => {
        if (data) {
          const messages = Object.entries(data)
            .map(([id, message]: [string, any]) => ({
              id,
              ...message
            }))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          
          this.messages.set(messages);
          this.chatService.markMessagesAsRead();
        }
      });
  }

  switchTab(tab: 'subscriptions' | 'chat') {
    this.activeTab.set(tab);
    if (tab === 'chat') {
      this.chatService.markMessagesAsRead();
    }
  }

  async sendMessage() {
    const text = this.newMessage().trim();
    if (!text) return;

    this.isLoading.set(true);
    try {
      await this.chatService.sendMessage(text);
      this.newMessage.set('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async requestSubscription(serviceCod: string, serviceName: string) {
    this.isLoading.set(true);
    try {
      await this.subscriptionService.requestSubscription(serviceCod, serviceName);
      await this.loadData(); // Recarregar dados para mostrar a solicitação pendente
    } catch (error) {
      console.error('Erro ao solicitar assinatura:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async requestCancellation(serviceCod: string) {
    if (!confirm('Tem certeza que deseja cancelar esta assinatura?')) return;

    this.isLoading.set(true);
    try {
      await this.subscriptionService.requestCancellation(serviceCod);
      await this.loadData();
    } catch (error) {
      console.error('Erro ao solicitar cancelamento:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR');
  }
}