import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService, Subscription, RequestSub } from '../../../services/subscription.service';
import { Subscription as RxSubscription } from 'rxjs';
import { Service } from '../../../models/service.model';
import { UiService } from '../../../services/ui.service';

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
  isLoading = true;
  services: Service[] = [];

  private dataSubscription?: RxSubscription;

  constructor(
    private subscriptionService: SubscriptionService,
    private uiService: UiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }

  private loadData() {
    this.isLoading = true;

    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    const servicesSub = this.subscriptionService.getAllServices()
      .subscribe({
        next: (services) => {
          this.services = services;
          console.log('Services:', services);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao carregar serviços:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });

    const subscriptionsSub = this.subscriptionService.getActiveSubscriptions()
      .subscribe({
        next: (subscriptions) => {
          this.subscriptions = subscriptions;
        },
        error: (error) => {
          console.error('Erro ao carregar assinaturas:', error);
        }
      });

    const requestsSub = this.subscriptionService.getPendingRequests()
      .subscribe({
        next: (requests) => {
          this.pendingRequests = requests;
        },
        error: (error) => {
          console.error('Erro ao carregar solicitações:', error);
        }
      });

    this.dataSubscription = new RxSubscription();
    this.dataSubscription.add(servicesSub);
    this.dataSubscription.add(subscriptionsSub);
    this.dataSubscription.add(requestsSub);
  }

  async requestSubscription(serviceId: string, serviceName: string) {
    try {
      const confirmed = await this.uiService.showConfirm(
        `Deseja solicitar a assinatura do serviço "${serviceName}"?`,
        'Confirmar Assinatura',
        'Sim, Solicitar',
        'Cancelar'
      );

      if (!confirmed) return;

      const hideLoading = this.uiService.showLoading('Processando sua solicitação...');

      try {
        await this.subscriptionService.requestSubscription(serviceId, serviceName);

        hideLoading();

        await this.uiService.showAlert(
          'Solicitação enviada com sucesso! Você receberá uma confirmação em breve.',
          'Sucesso'
        );

        await this.loadData();

      } catch (error) {
        hideLoading();
        throw error;
      }

    } catch (error: any) {
      console.error('Erro ao solicitar assinatura:', error);
      await this.uiService.showAlert(
        error?.message || 'Erro ao processar sua solicitação. Tente novamente.',
        'Erro'
      );
    }
  }

  async cancelRequest(request: RequestSub) {
    try {
      const confirmed = await this.uiService.showConfirm(
        'Deseja cancelar esta solicitação?',
        'Cancelar Solicitação',
        'Sim, Cancelar',
        'Manter'
      );

      if (!confirmed) return;

      const hideLoading = this.uiService.showLoading('Cancelando solicitação...');

      try {
        await this.subscriptionService.cancelRequest(request.id);

        hideLoading();

        await this.uiService.showAlert(
          'Solicitação cancelada com sucesso!',
          'Sucesso'
        );

        await this.loadData();

      } catch (error) {
        hideLoading();
        throw error;
      }

    } catch (error: any) {
      console.error('Erro ao cancelar solicitação:', error);
      await this.uiService.showAlert(
        error?.message || 'Erro ao cancelar solicitação. Tente novamente.',
        'Erro'
      );
    }
  }

  async cancelSubscription(sub: Subscription) {
    try {
      const confirmed = await this.uiService.showConfirm(
        'Tem certeza que deseja cancelar esta assinatura?',
        'Cancelar Assinatura',
        'Sim, Cancelar',
        'Manter'
      );

      if (!confirmed) return;

      const hideLoading = this.uiService.showLoading('Processando cancelamento...');

      try {
        await this.subscriptionService.cancelSubscription(sub.id);

        hideLoading();

        await this.uiService.showAlert(
          'Assinatura cancelada com sucesso!',
          'Sucesso'
        );

        await this.loadData();

      } catch (error) {
        hideLoading();
        throw error;
      }

    } catch (error: any) {
      console.error('Erro ao cancelar assinatura:', error);
      await this.uiService.showAlert(
        error?.message || 'Erro ao cancelar assinatura. Tente novamente.',
        'Erro'
      );
    }
  }

  getServiceName(serviceId: string): string {
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.name : `Serviço ${serviceId}`;
  }

  getServicePixLink(serviceId: string): string {
    const service = this.services.find(s => s.id === serviceId);
    return service?.linkPix || '';
  }

  formatDate(dateString: string, format: 'full' | 'short' = 'full'): string {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }

      if (format === 'short') {
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }

      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Data inválida';
    }
  }

  async viewSubscriptionDetails(sub: Subscription) {
    const service = this.services.find(s => s.id === sub.serviceId);

    const details = `
      <strong>Serviço:</strong> ${service?.name || 'N/A'}<br>
      <strong>Status:</strong> ${sub.status === 'active' ? 'Ativa' :
        sub.status === 'pending' ? 'Pendente' : 'Inativa'}<br>
      <strong>Data de início:</strong> ${this.formatDate(sub.createdAt)}<br>
      <strong>Próxima cobrança:</strong> ${this.formatDate(sub.nextCharge)}<br>
      <strong>Pagamento:</strong> ${sub.paid ? 'Confirmado' : 'Pendente'}<br>
      <strong>ID:</strong> ${sub.id}
    `;

    await this.uiService.showAlert(details, 'Detalhes da Assinatura');
  }

  async viewServiceDetails(service: Service) {
    const modalHtml = `
      <div class="service-details-modal">
        <div class="service-content">
          <div class="service-header">
            <h3 class="service-name">${this.escapeHtml(service.name)}</h3>
            <div class="service-price">
              R$ ${service.price.toFixed(2).replace('.', ',')}
              <span class="price-period">/mês</span>
            </div>
          </div>

          <div class="service-description">
            <h4 class="section-title">Descrição</h4>
            <p>${this.escapeHtml(service.description)}</p>
          </div>

          <div class="service-tech">
            <h4 class="section-title">Informações Técnicas</h4>
            <div class="tech-grid">
              <div class="tech-item">
                <span class="tech-label">ID do Serviço:</span>
                <span class="tech-value">${service.id}</span>
              </div>
              <div class="tech-item">
                <span class="tech-label">Criado em:</span>
                <span class="tech-value">${this.formatDate(service.createdAt)}</span>
              </div>
              <div class="tech-item">
                <span class="tech-label">Atualizado em:</span>
                <span class="tech-value">${this.formatDate(service.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="service-actions">
          <button class="btn btn-secondary close-btn">
            <i class="fas fa-times mr-2"></i>
            Fechar
          </button>
          <button class="btn btn-primary request-btn">
            <i class="fas fa-paper-plane mr-2"></i>
            Solicitar Serviço
          </button>
        </div>
      </div>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'service-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = modalHtml;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    this.initCarousel(modal);

    const closeModal = () => {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    };

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn?.addEventListener('click', closeModal);

    const requestBtn = modal.querySelector('.request-btn');
    requestBtn?.addEventListener('click', async () => {
      closeModal();
      await this.requestSubscription(service.id, service.name);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  private initCarousel(modal: HTMLElement) {
    const slides = modal.querySelectorAll('.carousel-slide');
    const indicators = modal.querySelectorAll('.indicator');
    const prevBtn = modal.querySelector('.prev-btn');
    const nextBtn = modal.querySelector('.next-btn');

    let currentSlide = 0;

    const showSlide = (index: number) => {
      slides.forEach(slide => slide.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));

      slides[index].classList.add('active');
      indicators[index].classList.add('active');
      currentSlide = index;
    };

    prevBtn?.addEventListener('click', () => {
      const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
      showSlide(newIndex);
    });

    nextBtn?.addEventListener('click', () => {
      const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
      showSlide(newIndex);
    });

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showSlide(index);
      });
    });

    const autoRotate = () => {
      const nextIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
      showSlide(nextIndex);
    };

    let rotateInterval = setInterval(autoRotate, 5000);

    modal.addEventListener('mouseenter', () => clearInterval(rotateInterval));
    modal.addEventListener('mouseleave', () => {
      rotateInterval = setInterval(autoRotate, 5000);
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.removedNodes.length > 0) {
          clearInterval(rotateInterval);
          observer.disconnect();
        }
      });
    });

    observer.observe(modal.parentNode || document.body, { childList: true });
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  copyPix(link: string) {
    if (!link) {
      this.uiService.showAlert("Link PIX não disponível para este serviço.");
      return;
    }

    navigator.clipboard.writeText(link)
      .then(() => {
        this.uiService.showAlert("Link PIX copiado para a área de transferência!");
      })
      .catch(() => {
        this.uiService.showAlert("Erro ao copiar link PIX. Tente novamente!");
      });
  }

  copyPixForSubscription(sub: Subscription) {
    const pixLink = this.getServicePixLink(sub.serviceId);
    if (!pixLink) {
      this.uiService.showAlert("Link PIX não encontrado para esta assinatura.");
      return;
    }
    
    // Adicionar informações da assinatura ao link PIX (opcional)
    const enhancedLink = `${pixLink}&subscriptionId=${sub.id}`;
    this.copyPix(enhancedLink);
  }

  copyPixForRequest(request: RequestSub) {
    const pixLink = this.getServicePixLink(request.serviceId);
    if (!pixLink) {
      this.uiService.showAlert("Link PIX não encontrado para esta solicitação.");
      return;
    }
    
    // Adicionar informações da solicitação ao link PIX (opcional)
    const enhancedLink = `${pixLink}&requestId=${request.id}`;
    this.copyPix(enhancedLink);
  }
}