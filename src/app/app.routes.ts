import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ClientSection } from './pages/client-section/client-section';
import { Auth } from './pages/auth/auth';

export const routes: Routes = [
    { path: 'home', component: Home },
    { path: 'client', component: ClientSection },
    { path: 'auth', component: Auth},
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];