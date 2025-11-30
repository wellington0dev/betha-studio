import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { ClientDashboard } from '../../components/client-dashboard/client-dashboard';
import { SuportChat } from '../../components/suport-chat/suport-chat';
import { ClientSubscriptions } from '../../components/client-subscriptions/client-subscriptions';

@Component({
  selector: 'app-client-section',
  imports: [
        Navbar,
        Footer,
        ClientDashboard,
        SuportChat,
        ClientSubscriptions
  ],
  templateUrl: './client-section.html',
  styleUrl: './client-section.scss',
})
export class ClientSection {

}
