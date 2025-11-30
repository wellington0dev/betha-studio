import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService, Subscription, SubscriptionRequest } from '../../services/subscription.service';
import { Subscription as RxSubscription } from 'rxjs';

@Component({
  selector: 'app-client-subscriptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-subscriptions.html',
  styleUrl: './client-subscriptions.scss',
})
export class ClientSubscriptions implements OnInit, OnDestroy {
  subscriptions = signal<Subscription[]>([]);
  pendingRequests = signal<SubscriptionRequest[]>([]);
  isLoading = signal(false);

  private subscriptionsSubscription?: RxSubscription;

  constructor(private subscriptionService: SubscriptionService) {}

  async ngOnInit() {
    await this.loadData();
    this.setupRealTimeListeners();
  }

  ngOnDestroy() {
    this.subscriptionsSubscription?.unsubscribe();
  }

  private async loadData() {
    this.isLoading.set(true);
    try {
      const [subscriptions, requests] = await Promise.all([
        this.subscriptionService.getActiveSubscriptions(),
        this.subscriptionService.getPendingRequests()
      ]);

      this.subscriptions.set(subscriptions);
      this.pendingRequests.set(requests);
    } catch (error) {
      console.error('Erro ao carregar assinaturas:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private setupRealTimeListeners() {
    this.subscriptionsSubscription = this.subscriptionService.getSubscriptionsRealTime()
      .subscribe((data: any) => {
        if (data) {
          this.subscriptions.set(Object.values(data));
        }
      });
  }

  async requestSubscription(serviceCod: string, serviceName: string) {
    this.isLoading.set(true);
    try {
      await this.subscriptionService.requestSubscription(serviceCod, serviceName);
      await this.loadData();
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}