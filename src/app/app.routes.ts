import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ClientSection } from './pages/client-section/client-section';
import { Auth } from './pages/auth/auth';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'home', component: Home, canActivate:[] },
    { path: 'client', component: ClientSection, canActivate:[AuthGuard] },
    { path: 'auth', component: Auth},
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];