import { Component, signal, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService, Message } from '../../../services/chat.service';
import { Subscription as RxSubscription } from 'rxjs';

@Component({
  selector: 'app-suport-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suport-chat.html',
  styleUrl: './suport-chat.scss',
})
export class SuportChat implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  @Output() linkSelected = new EventEmitter<'dashboard' | 'subscriptions' | 'chat'>();

  messages = signal<Message[]>([]);
  newMessage = signal('');
  isLoading = signal(false);

  private messagesSubscription?: RxSubscription;

  constructor(
    private chatService: ChatService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadMessages();
    this.setupRealTimeListener();
  }

  ngOnDestroy() {
    this.messagesSubscription?.unsubscribe();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private async loadMessages() {
    this.isLoading.set(true);
    try {
      const messages = await this.chatService.getMessages();
      this.messages.set(messages);
      await this.chatService.markMessagesAsRead();
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private setupRealTimeListener() {
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
          // Marca como lido quando novas mensagens chegam
          this.chatService.markMessagesAsRead();
        }
      });
  }

  // Navegação
  goBack() {
    //this.router.navigate(['/client']);
     this.linkSelected.emit('subscriptions');
  }

  // Envio de mensagens
  async sendMessage() {
    const text = this.newMessage().trim();
    if (!text || this.isLoading()) return;

    this.isLoading.set(true);
    try {
      await this.chatService.sendMessage(text);
      this.newMessage.set('');
      this.autoResizeTextarea(); // Reseta o tamanho do textarea
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Manipulação do teclado - CORRIGIDO AQUI
  // Método alternativo mais seguro
onKeyPress(event: Event) {
  const keyboardEvent = event as KeyboardEvent;
  if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
    keyboardEvent.preventDefault();
    this.sendMessage();
  }
}

  // Utilitários
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Se for hoje, mostra apenas a hora
    if (diffDays === 0) {
      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return `${diffMins} min atrás`;
      if (diffHours < 24) return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    // Se for ontem
    if (diffDays === 1) return 'Ontem ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Se for mais antigo
    if (diffDays < 7) {
      return date.toLocaleDateString('pt-BR', { 
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Data completa
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Scroll automático
  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        if (this.messageContainer?.nativeElement) {
          this.messageContainer.nativeElement.scrollTop = 
            this.messageContainer.nativeElement.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error('Erro ao fazer scroll:', err);
    }
  }

  // Auto-resize do textarea
  autoResizeTextarea() {
    setTimeout(() => {
      if (this.messageInput?.nativeElement) {
        const textarea = this.messageInput.nativeElement;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      }
    }, 0);
  }
}