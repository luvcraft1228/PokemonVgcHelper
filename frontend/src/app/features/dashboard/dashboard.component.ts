import { Component, signal, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SharedModule } from '../../shared/shared.module';

/**
 * Composant dashboard utilisateur.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

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

