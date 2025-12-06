import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService, Subscription, RequestSub } from '../../services/subscription.service';
import { Subscription as RxSubscription } from 'rxjs';
import { Service } from '../../models/service.model';

@Component({
  selector: 'app-client-subscriptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-subscriptions.html',
  styleUrl: './client-subscriptions.scss',
})
export class ClientSubscriptions implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  pendingRequests: RequestSub[] = [];
  isLoading = true; // Inicia como true
  services: Service[] = [];

  private dataSubscription?: RxSubscription;

  constructor(
    private subscriptionService: SubscriptionService,
    private cdr: ChangeDetectorRef // Adiciona isso
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }

  private loadData() {
    this.isLoading = true;
    
    // Limpa subscription anterior se existir
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    // Carrega serviços
    const servicesSub = this.subscriptionService.getAllServices()
      .subscribe({
        next: (services) => {
          this.services = services;
          console.log('Services:', services);
          this.isLoading = false;
          this.cdr.detectChanges(); // Força detecção de mudanças
        },
        error: (err) => {
          console.error('Erro ao carregar serviços:', err);
          this.isLoading = false;
          this.cdr.detectChanges(); // Força detecção de mudanças
        }
      });

    // Carrega assinaturas
    const subscriptionsSub = this.subscriptionService.getActiveSubscriptions()
      .subscribe({
        next: (subscriptions) => {
          this.subscriptions = subscriptions;
        },
        error: (error) => {
          console.error('Erro ao carregar assinaturas:', error);
        }
      });

    // Carrega solicitações
    const requestsSub = this.subscriptionService.getPendingRequests()
      .subscribe({
        next: (requests) => {
          this.pendingRequests = requests;
        },
        error: (error) => {
          console.error('Erro ao carregar solicitações:', error);
        }
      });

    // Cria uma subscription combinada
    this.dataSubscription = new RxSubscription();
    this.dataSubscription.add(servicesSub);
    this.dataSubscription.add(subscriptionsSub);
    this.dataSubscription.add(requestsSub);
  }

  async requestSubscription(serviceId: string, serviceName: string) {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    try {
      await this.subscriptionService.requestSubscription(serviceId, serviceName);
      this.loadData();
    } catch (error) {
      console.error('Erro ao solicitar assinatura:', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // Método para obter nome do serviço pelo ID
  getServiceName(serviceId: string): string {
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.name : `Serviço ${serviceId}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}