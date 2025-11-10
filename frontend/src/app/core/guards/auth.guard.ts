import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Guard qui protège les routes nécessitant une authentification.
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.isAuthenticated).pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      return true;
    })
  );
};

