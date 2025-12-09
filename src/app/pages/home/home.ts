import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Hero } from '../../components/home/hero/hero';
import { Services } from '../../components/home/services/services';
import { About } from '../../components/home/about/about';
import { Projects } from '../../components/home/projects/projects';
import { Contact } from '../../components/home/contact/contact';
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
