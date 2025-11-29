// src/app/components/footer/footer.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class Footer {
  currentYear: number = new Date().getFullYear();
}