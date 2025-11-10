import { Component } from '@angular/core';
import { NavComponent } from './core/components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [NavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
