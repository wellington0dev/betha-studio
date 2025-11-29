import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { Services } from '../../components/services/services';
import { About } from '../../components/about/about';
import { Projects } from '../../components/projects/projects';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [
    Navbar,
    Hero,
    Services,
    About,
    Projects,
    Contact,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  title = 'betha-studio';
}
