import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { AuthService } from './auth.service';

export interface Message {
  id?: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private db: DatabaseService,
    private auth: AuthService
  ) {}

  // Enviar mensagem
  async sendMessage(text: string): Promise<void> {
    const user = this.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const message: Message = {
      text: text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      read: false
    };

    const messageId = Date.now().toString();
    await this.db.writeData(`chats/${user.uid}/messages`, message, messageId);
  }

  // Obter histórico de mensagens
  async getMessages(): Promise<Message[]> {
    const user = this.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const messages = await this.db.readData(`chats/${user.uid}/messages`, '');
      if (!messages) return [];

      return Object.entries(messages)
        .map(([id, message]: [string, any]) => ({
          id,
          ...message
        }))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      return [];
    }
  }

  // Observar mensagens em tempo real
  getMessagesRealTime() {
    const user = this.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    return this.db.readInRealTime(`chats/${user.uid}/messages`, '');
  }

  // Marcar mensagens como lidas
  async markMessagesAsRead(): Promise<void> {
    const user = this.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const messages = await this.getMessages();
      const unreadMessages = messages.filter(msg => !msg.read && msg.sender === 'admin');

      for (const message of unreadMessages) {
        await this.db.updateData(`chats/${user.uid}/messages`, message.id!, { read: true });
      }
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
    }
  }
}