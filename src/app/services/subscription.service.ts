import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

export interface SubscriptionRequest {
  service: string;
  serviceCod: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Subscription {
  service: string;
  serviceCod: string;
  createdAt: string;
  paid: boolean;
  nextCharge: string;
  status: 'active' | 'cancelled' | 'suspended';
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
    private db: DatabaseService,
    private auth: AuthService
  ) {}

  // Solicitar nova assinatura
  async requestSubscription(serviceCod: string, serviceName: string): Promise<void> {
    const user = this.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const request: SubscriptionRequest = {
      service: serviceName,
      serviceCod: serviceCod,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    await this.db.writeData(`subscriptions/${user.uid}/requests`, request, serviceCod);
  }

  // Cancelar assinatura (solicitar cancelamento)
  async requestCancellation(serviceCod: string): Promise<void> {
    const user = this.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const cancellationRequest = {
      serviceCod: serviceCod,
      type: 'cancellation',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    await this.db.writeData(`subscriptions/${user.uid}/requests`, cancellationRequest, `cancel_${serviceCod}`);
  }

  // Obter assinaturas ativas
  async getActiveSubscriptions(): Promise<Subscription[]> {
    const user = this.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const subscriptions = await this.db.readData(`subscriptions/${user.uid}/subs`, '');
      return subscriptions ? Object.values(subscriptions) : [];
    } catch (error) {
      return [];
    }
  }

  // Obter solicitações pendentes
  async getPendingRequests(): Promise<SubscriptionRequest[]> {
    const user = this.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const requests = await this.db.readData(`subscriptions/${user.uid}/requests`, '');
      return requests ? Object.values(requests) : [];
    } catch (error) {
      return [];
    }
  }

  // Observar assinaturas em tempo real
  getSubscriptionsRealTime() {
    const user = this.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    return this.db.readInRealTime(`subscriptions/${user.uid}/subs`, '');
  }
}