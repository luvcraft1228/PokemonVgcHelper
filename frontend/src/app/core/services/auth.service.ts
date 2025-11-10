import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Service de gestion de l'authentification.
 * Gère le login, register, refresh et logout.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly isAuthenticatedSignal = signal<boolean>(this.hasValidToken());

  /**
   * Signal indiquant si l'utilisateur est authentifié.
   */
  public readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor(private apiService: ApiService) {}

  /**
   * Vérifie si un token valide existe.
   * @returns True si un token existe et n'est pas expiré.
   */
  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (!token) {
      return false;
    }
    // Vérification basique : on pourrait décoder le JWT pour vérifier l'expiration
    return token.length > 0;
  }

  /**
   * Enregistre un nouvel utilisateur.
   * @param credentials Identifiants d'inscription.
   * @returns Observable des tokens d'authentification.
   */
  register(credentials: RegisterCredentials): Observable<AuthTokens> {
    return this.apiService.post<AuthTokens>('/auth/register', credentials).pipe(
      tap((tokens) => this.storeTokens(tokens))
    );
  }

  /**
   * Connecte un utilisateur.
   * @param credentials Identifiants de connexion.
   * @returns Observable des tokens d'authentification.
   */
  login(credentials: LoginCredentials): Observable<AuthTokens> {
    return this.apiService.post<AuthTokens>('/auth/login', credentials).pipe(
      tap((tokens) => this.storeTokens(tokens))
    );
  }

  /**
   * Rafraîchit les tokens d'authentification.
   * @returns Observable des nouveaux tokens.
   */
  refresh(): Observable<AuthTokens> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('Aucun refresh token disponible');
    }
    return this.apiService.post<AuthTokens>('/auth/refresh', { refreshToken }).pipe(
      tap((tokens) => this.storeTokens(tokens))
    );
  }

  /**
   * Déconnecte l'utilisateur.
   * @returns Observable vide.
   */
  logout(): Observable<void> {
    return this.apiService.post<void>('/auth/logout', {}).pipe(
      tap(() => this.clearTokens())
    );
  }

  /**
   * Récupère le token d'accès actuel.
   * @returns Token d'accès ou null.
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Stocke les tokens dans le localStorage.
   * @param tokens Tokens à stocker.
   */
  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Supprime les tokens du localStorage.
   */
  private clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.isAuthenticatedSignal.set(false);
  }
}

