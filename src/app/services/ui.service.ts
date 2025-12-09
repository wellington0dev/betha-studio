// src/app/services/ui.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private body: HTMLElement;

  constructor() { 
    this.body = document.body;
  }

  /**
   * Mostra um alerta simples
   * @param msg Mensagem a ser exibida
   * @param title Título do alerta (opcional)
   */
  async showAlert(msg: string, title: string = 'Atenção'): Promise<void> {
    return new Promise((resolve) => {
      // Cria o overlay
      const overlay = this.createOverlay();
      
      // Cria o modal de alerta
      const modal = document.createElement('div');
      modal.className = 'ui-modal alert-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${this.escapeHtml(title)}</h3>
            <button class="close-btn" type="button">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>${this.escapeHtml(msg)}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary confirm-btn" type="button">
              OK
            </button>
          </div>
        </div>
      `;

      overlay.appendChild(modal);
      this.body.appendChild(overlay);

      // Fecha o modal ao clicar no overlay
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.removeModal(overlay);
          resolve();
        }
      });

      // Fecha o modal ao clicar no botão de fechar
      const closeBtn = modal.querySelector('.close-btn');
      closeBtn?.addEventListener('click', () => {
        this.removeModal(overlay);
        resolve();
      });

      // Fecha o modal ao clicar no botão OK
      const confirmBtn = modal.querySelector('.confirm-btn');
      confirmBtn?.addEventListener('click', () => {
        this.removeModal(overlay);
        resolve();
      });

      // Fecha com a tecla ESC
      const escHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          this.removeModal(overlay);
          resolve();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    });
  }

  /**
   * Mostra uma confirmação com dois botões
   * @param msg Mensagem de confirmação
   * @param title Título (opcional)
   * @param confirmText Texto do botão confirmar (opcional)
   * @param cancelText Texto do botão cancelar (opcional)
   * @returns Promise<boolean> true se confirmado, false se cancelado
   */
  async showConfirm(
    msg: string, 
    title: string = 'Confirmação',
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const overlay = this.createOverlay();
      
      const modal = document.createElement('div');
      modal.className = 'ui-modal confirm-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${this.escapeHtml(title)}</h3>
            <button class="close-btn" type="button">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>${this.escapeHtml(msg)}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary cancel-btn" type="button">
              ${this.escapeHtml(cancelText)}
            </button>
            <button class="btn btn-primary confirm-btn" type="button">
              ${this.escapeHtml(confirmText)}
            </button>
          </div>
        </div>
      `;

      overlay.appendChild(modal);
      this.body.appendChild(overlay);

      // Função para fechar com resultado
      const closeWithResult = (result: boolean) => {
        this.removeModal(overlay);
        resolve(result);
      };

      // Fecha ao clicar no overlay (cancel)
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeWithResult(false);
        }
      });

      // Botão fechar (cancel)
      const closeBtn = modal.querySelector('.close-btn');
      closeBtn?.addEventListener('click', () => closeWithResult(false));

      // Botão cancelar
      const cancelBtn = modal.querySelector('.cancel-btn');
      cancelBtn?.addEventListener('click', () => closeWithResult(false));

      // Botão confirmar
      const confirmBtn = modal.querySelector('.confirm-btn');
      confirmBtn?.addEventListener('click', () => closeWithResult(true));

      // ESC cancela
      const escHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeWithResult(false);
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    });
  }

  /**
   * Mostra um input para o usuário
   * @param msg Mensagem/instrução
   * @param title Título (opcional)
   * @param placeholder Placeholder do input (opcional)
   * @param defaultValue Valor padrão (opcional)
   * @returns Promise<string | null> valor digitado ou null se cancelado
   */
  async showInput(
    msg: string, 
    title: string = 'Entrada',
    placeholder: string = 'Digite aqui...',
    defaultValue: string = ''
  ): Promise<string | null> {
    return new Promise((resolve) => {
      const overlay = this.createOverlay();
      
      const modal = document.createElement('div');
      modal.className = 'ui-modal input-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${this.escapeHtml(title)}</h3>
            <button class="close-btn" type="button">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p class="input-label">${this.escapeHtml(msg)}</p>
            <input 
              type="text" 
              class="input-field" 
              placeholder="${this.escapeHtml(placeholder)}"
              value="${this.escapeHtml(defaultValue)}"
              autofocus
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary cancel-btn" type="button">
              Cancelar
            </button>
            <button class="btn btn-primary confirm-btn" type="button">
              OK
            </button>
          </div>
        </div>
      `;

      overlay.appendChild(modal);
      this.body.appendChild(overlay);

      // Foca no input
      setTimeout(() => {
        const input = modal.querySelector('.input-field') as HTMLInputElement;
        input?.focus();
        input?.select();
      }, 100);

      // Função para fechar com resultado
      const closeWithResult = (result: string | null) => {
        this.removeModal(overlay);
        resolve(result);
      };

      // Fecha ao clicar no overlay (cancel)
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeWithResult(null);
        }
      });

      // Botão fechar (cancel)
      const closeBtn = modal.querySelector('.close-btn');
      closeBtn?.addEventListener('click', () => closeWithResult(null));

      // Botão cancelar
      const cancelBtn = modal.querySelector('.cancel-btn');
      cancelBtn?.addEventListener('click', () => closeWithResult(null));

      // Botão OK
      const confirmBtn = modal.querySelector('.confirm-btn');
      confirmBtn?.addEventListener('click', () => {
        const input = modal.querySelector('.input-field') as HTMLInputElement;
        closeWithResult(input?.value?.trim() || '');
      });

      // Enter confirma, ESC cancela
      const keyHandler = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const input = modal.querySelector('.input-field') as HTMLInputElement;
          closeWithResult(input?.value?.trim() || '');
          document.removeEventListener('keydown', keyHandler);
        } else if (e.key === 'Escape') {
          closeWithResult(null);
          document.removeEventListener('keydown', keyHandler);
        }
      };
      document.addEventListener('keydown', keyHandler);
    });
  }

  /**
   * Mostra um loading spinner
   * @param msg Mensagem opcional
   */
  showLoading(msg?: string): () => void {
    const overlay = this.createOverlay();
    overlay.classList.add('loading-overlay');
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
      <div class="spinner-content">
        <div class="spinner"></div>
        ${msg ? `<p class="loading-message">${this.escapeHtml(msg)}</p>` : ''}
      </div>
    `;

    overlay.appendChild(spinner);
    this.body.appendChild(overlay);

    // Retorna função para remover o loading
    return () => this.removeModal(overlay);
  }

  /**
   * Cria um overlay para os modais
   */
  private createOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'ui-modal-overlay';
    return overlay;
  }

  /**
   * Remove um modal do DOM
   */
  private removeModal(overlay: HTMLElement): void {
    if (overlay && overlay.parentNode) {
      // Adiciona animação de fade out
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.parentNode?.removeChild(overlay);
      }, 300);
    }
  }

  /**
   * Escapa HTML para prevenir XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}