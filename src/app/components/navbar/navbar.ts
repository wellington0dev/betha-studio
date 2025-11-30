import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

interface NavLink {
  name: string;
  href: string;
  type: 'internal' | 'external' | 'section' | 'route';
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar implements OnInit {
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
    { name: 'Dashboard', href: 'dashboard', type: 'section' },
    { name: 'Assinaturas', href: 'subscriptions', type: 'section' },
    { name: 'Suporte', href: 'chat', type: 'section' },
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
    } else if (url.startsWith('/customer')) {
      this.currentLinks = this.navClientLinks;
    } else {
      // Links padrão para outras páginas
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

  handleNavigation(href: string, type: string): void {
    this.closeMenu();

    switch (type) {
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
    } else {
      console.warn(`Seção não encontrada: ${sectionId}`);
      // Fallback: rolar para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  scrollTo(sectionId: string): void {
    this.closeMenu();
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private navigateToRoute(route: string): void {
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