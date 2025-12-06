import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { AuthService } from './auth.service';
import { Observable, map, from, of } from 'rxjs';

export interface RequestSub {
  id: string;                    
  userId: string;                
  serviceId: string;             
  createdAt: string;             
  status: 'pending' | 'approved' | 'rejected'; 
  updatedAt?: string;            
  notes?: string;                
  subscriptionId?: string;       
}

export interface Subscription {
  id: string;                    
  userId: string;                
  serviceId: string;             
  createdAt: string;             
  paid: boolean;                 
  nextCharge: string;            
  status: 'active' | 'inactive' | 'pending'; 
  updatedAt?: string;            
  approvedBy?: string;           
  approvedAt?: string;           
  requestId?: string;            
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}


@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
    private db: DatabaseService,
    private auth: AuthService
  ) { }

  getAllServices(): Observable<Service[]> {
  return this.db.readInRealTime('services', '').pipe(
    map((services: any) => {
      console.log('Raw data from Firebase:', services);
      
      if (!services) {
        console.log('No services found');
        return [];
      }

      // Converter objeto para array e adicionar ID
      const servicesArray = Object.keys(services).map(id => ({
        id,
        ...services[id]
      }));
      
      console.log('Processed services:', servicesArray);
      
      // REMOVE O FILTRO ou ajusta:
      // Opção 1: Sem filtro (retorna tudo)
      return servicesArray;
      
      // Opção 2: Filtro corrigido (se não tiver active, considera ativo)
      // return servicesArray.filter(service =>
      //   service.active === undefined || service.active === true
      // );
    })
  );
}

  /**
   * Buscar serviços por termo de busca
   */
  searchServices(searchTerm: string): Observable<Service[]> {
    return this.getAllServices().pipe(
      map(services => {
        if (!searchTerm.trim()) return services;

        const term = searchTerm.toLowerCase();
        return services.filter(service => {
          // Buscar no nome
          if (service.name.toLowerCase().includes(term)) return true;

          // Buscar na descrição
          if (service.description.toLowerCase().includes(term)) return true;

          return false;
        });
      })
    );
  }

  /**
   * Obter serviço por ID
   */
  getServiceById(serviceId: string): Observable<Service | null> {
    return this.db.readInRealTime('Services', serviceId).pipe(
      map((service: any) => {
        if (!service) return null;
        return { id: serviceId, ...service };
      })
    );
  }

  // ========== FUNÇÕES DE SOLICITAÇÕES (USER) ==========

  /**
   * Gerar ID único para solicitação
   */
  private generateRequestId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  async requestSubscription(serviceId: string, notes?: string): Promise<string> {
    const userId = this.auth.getUserId();
    if (!userId) throw new Error('Usuário não autenticado');

    const requestId = serviceId;
    const now = new Date().toISOString();

    const request: Omit<RequestSub, 'id'> = {
      userId,
      serviceId,
      createdAt: now,
      status: 'pending',
      updatedAt: now,
      notes
    };

    await this.db.writeData(`subscriptions/${userId}/requests`, request, requestId);
    return requestId;
  }

  getUserRequests(): Observable<RequestSub[]> {
    const userId = this.auth.getUserId();
    if (!userId) throw new Error('Usuário não autenticado');

    return this.db.readInRealTime(`subscriptions/${userId}/requests`, '').pipe(
      map((requests: any) => {
        if (!requests) return [];

        return Object.keys(requests).map(id => ({
          id,
          ...requests[id]
        } as RequestSub));
      })
    );
  }

  getPendingRequests(): Observable<RequestSub[]> {
    return this.getUserRequests().pipe(
      map(requests =>
        requests.filter(request => request.status === 'pending')
      )
    );
  }

  getRequestById(requestId: string): Observable<RequestSub | null> {
    const userId = this.auth.getUserId();
    if (!userId) throw new Error('Usuário não autenticado');

    return this.db.readInRealTime(`subscriptions/${userId}/requests`, requestId).pipe(
      map((request: any) => {
        if (!request) return null;
        return { id: requestId, ...request } as RequestSub;
      })
    );
  }

  async cancelRequest(requestId: string): Promise<void> {
    const userId = this.auth.getUserId();
    if (!userId) throw new Error('Usuário não autenticado');

    const request = await from(this.db.readData(`subscriptions/${userId}/requests`, requestId)).toPromise();
    if (!request) throw new Error('Solicitação não encontrada');
    if (request.status !== 'pending') {
      throw new Error('Só é possível cancelar solicitações pendentes');
    }

    const updateData = {
      ...request,
      status: 'rejected' as const,
      updatedAt: new Date().toISOString()
    };

    await this.db.updateData(`subscriptions/${userId}/requests`, requestId, updateData);
  }

  getUserSubscriptions(): Observable<Subscription[]> {
    const userId = this.auth.getUserId();
    if (!userId) throw new Error('Usuário não autenticado');

    return this.db.readInRealTime(`subscriptions/${userId}/subs`, '').pipe(
      map((subscriptions: any) => {
        if (!subscriptions) return [];

        return Object.keys(subscriptions).map(id => ({
          id,
          ...subscriptions[id]
        } as Subscription));
      })
    );
  }

  getActiveSubscriptions(): Observable<Subscription[]> {
    return this.getUserSubscriptions().pipe(
      map(subscriptions =>
        subscriptions.filter(sub => sub.status === 'active')
      )
    );
  }

  getPaidSubscriptions(): Observable<Subscription[]> {
    return this.getUserSubscriptions().pipe(
      map(subscriptions =>
        subscriptions.filter(sub => sub.paid === true)
      )
    );
  }

  getSubscriptionById(subscriptionId: string): Observable<Subscription | null> {
    const userId = this.auth.getUserId();
    if (!userId) throw new Error('Usuário não autenticado');

    return this.db.readInRealTime(`subscriptions/${userId}/subs`, subscriptionId).pipe(
      map((subscription: any) => {
        if (!subscription) return null;
        return { id: subscriptionId, ...subscription } as Subscription;
      })
    );
  }

  hasActiveSubscription(serviceId: string): Observable<boolean> {
    return this.getActiveSubscriptions().pipe(
      map(subscriptions =>
        subscriptions.some(sub => sub.serviceId === serviceId)
      )
    );
  }

  canRequestSubscription(serviceId: string): Observable<{
    canRequest: boolean;
    reason?: string;
    existingSubscription?: Subscription;
  }> {
    return this.getActiveSubscriptions().pipe(
      map(activeSubscriptions => {
        const existingSubscription = activeSubscriptions.find(
          sub => sub.serviceId === serviceId
        );

        if (existingSubscription) {
          return {
            canRequest: false,
            reason: 'Você já possui uma assinatura ativa para este serviço',
            existingSubscription
          };
        }

        return {
          canRequest: true
        };
      })
    );
  }

  getSubscriptionSummary(): Observable<{
    total: number;
    active: number;
    paid: number;
    pending: number;
    nextPayment?: string;
  }> {
    return this.getUserSubscriptions().pipe(
      map(subscriptions => {
        const total = subscriptions.length;
        const active = subscriptions.filter(s => s.status === 'active').length;
        const paid = subscriptions.filter(s => s.paid).length;
        const pending = subscriptions.filter(s => !s.paid).length;

        const upcomingPayments = subscriptions
          .filter(s => s.status === 'active' && !s.paid)
          .map(s => new Date(s.nextCharge))
          .sort((a, b) => a.getTime() - b.getTime());

        const nextPayment = upcomingPayments.length > 0
          ? upcomingPayments[0].toISOString()
          : undefined;

        return {
          total,
          active,
          paid,
          pending,
          nextPayment
        };
      })
    );
  }

  /**
   * Observar mudanças em tempo real nas assinaturas do usuário
   */
  watchUserSubscriptions(): Observable<Subscription[]> {
    return this.getUserSubscriptions();
  }

  /**
   * Observar mudanças em tempo real nas solicitações do usuário
   */
  watchUserRequests(): Observable<RequestSub[]> {
    return this.getUserRequests();
  }

  /**
   * Verificar status de todas as solicitações e assinaturas
   */
  getSubscriptionStatus(serviceId: string): Observable<{
    hasActiveSubscription: boolean;
    hasPendingRequest: boolean;
    subscription?: Subscription;
    pendingRequest?: RequestSub;
  }> {
    return this.getActiveSubscriptions().pipe(
      map(activeSubscriptions => {
        const subscription = activeSubscriptions.find(sub => sub.serviceId === serviceId);

        return {
          hasActiveSubscription: !!subscription,
          subscription,
          hasPendingRequest: false, // Será preenchido pela solicitação se necessário
          pendingRequest: undefined
        };
      })
    );
  }
}