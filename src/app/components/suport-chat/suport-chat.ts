import { Component, signal, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Message } from '../../services/chat.service';
import { Subscription as RxSubscription } from 'rxjs';

@Component({
  selector: 'app-suport-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './suport-chat.html',
  styleUrl: './suport-chat.scss',
})
export class SuportChat implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messages = signal<Message[]>([]);
  newMessage = signal('');
  isLoading = signal(false);

  private messagesSubscription?: RxSubscription;

  constructor(private chatService: ChatService) {}

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
      this.chatService.markMessagesAsRead();
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
          this.chatService.markMessagesAsRead();
        }
      });
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Erro ao fazer scroll:', err);
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

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR');
  }
}