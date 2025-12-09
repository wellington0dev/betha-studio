import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { DatabaseService } from '../../../services/database.service';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class Contact {
  constructor(
    private db: DatabaseService,
    private uiService: UiService
  ) { }

  async sendMessage(form: NgForm, event?:Event) {
    event?.preventDefault()

    if (!form.valid) return alert("Preencha tudo certinho 😉");
    const id = uuid();

    const data = {
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message,
      status: "new",
      createdAt: new Date().toISOString()
    };

    try {
      await this.db.writeData("contacts/messages", data, id);
      this.uiService.showAlert('Mensagem enviada com sucesso. Em breve retornaremos.')
      form.reset();
    } catch (err) {
      console.error(err);
      this.uiService.showAlert("Erro ao enviar mensagem. Tente novamente mais tarde.")
    }
  }
}