import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

interface NavLink {
  name: string;
  href: string;
  type: 'internal' | 'external' | 'section' | 'route' | 'component';
  component?: 'dashboard' | 'subscriptions' | 'chat';
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar implements OnInit {
  @Output() linkSelected = new EventEmitter<'dashboard' | 'subscriptions' | 'chat'>();
  
  isOpen: boolean = false;
  scrolled: boolean = false;
  currentLinks: NavLink[] = [];

  navHomeLinks: NavLink[] = [
    { name: 'Início', href: 'home', type: 'section' },
    { name: 'Serviços', href: 'services', type: 'section' },
    { name: 'Sobre', href: 'about', type: 'section' },
    { name: 'Projetos', href: 'projects', type: 'section' },
    { name: 'Contato', href: 'contact', type: 'section' },
    { name: 'Área do Cliente', href: 'client', type: 'route' }
  ];

  navClientLinks: NavLink[] = [
   /*  { name: 'Dashboard', href: 'dashboard', type: 'component', component: 'dashboard' }, */
    { name: 'Assinaturas', href: 'subscriptions', type: 'component', component: 'subscriptions' },
    { name: 'Suporte', href: 'chat', type: 'component', component: 'chat' },
    { name: 'Voltar ao Início', href: '/', type: 'route' },
  ];

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.onWindowScroll();
    this.setLinks();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.setLinks());
  }

  setLinks(): void {
    const url = this.router.url;

    if (url === '/' || url === '/home') {
      this.currentLinks = this.navHomeLinks;
    } else if (url.startsWith('/client') || url.startsWith('/customer')) {
      this.currentLinks = this.navClientLinks;
    } else {
      this.currentLinks = [
        { name: 'Voltar ao Início', href: '/', type: 'route' }
      ];
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  handleNavigation(href: string, type: string, component?: 'dashboard' | 'subscriptions' | 'chat'): void {
    this.closeMenu();

    switch (type) {
      case 'component':
        if (component) {
          this.linkSelected.emit(component);
        }
        break;
      case 'section':
        this.scrollToSection(href);
        break;
      case 'route':
        this.navigateToRoute(href);
        break;
      case 'internal':
        this.navigateToRoute(href);
        break;
      case 'external':
        window.open(href, '_blank');
        break;
      default:
        console.warn('Tipo de navegação não reconhecido:', type);
    }
  }

  private scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navigateToRoute(route: string): void {
    if (route.startsWith('/')) {
      this.router.navigate([route]);
    } else {
      this.router.navigate(['/' + route]);
    }
  }

  isUserLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  getUserName(): string {
    return this.auth.getUserName();
  }

  logout(): void {
    this.auth.logout();
  }
}