import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { SharedModule } from '../../../shared/shared.module';

/**
 * Composant de navigation latérale (sidenav).
 * Visible uniquement pour les utilisateurs authentifiés.
 */
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    SharedModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Signal indiquant si l'utilisateur est authentifié.
   */
  readonly isAuthenticated = this.authService.isAuthenticated;

  /**
   * Gère la déconnexion de l'utilisateur.
   */
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Même en cas d'erreur, on déconnecte localement
        this.router.navigate(['/login']);
      },
    });
  }
}

