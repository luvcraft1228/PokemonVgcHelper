import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Service centralisé pour les appels API.
 * Gère la configuration de base des requêtes HTTP.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Effectue une requête GET.
   * @param endpoint Endpoint relatif à l'API.
   * @param options Options HTTP optionnelles.
   * @returns Observable de la réponse.
   */
  get<T>(endpoint: string, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, options);
  }

  /**
   * Effectue une requête POST.
   * @param endpoint Endpoint relatif à l'API.
   * @param body Corps de la requête.
   * @param options Options HTTP optionnelles.
   * @returns Observable de la réponse.
   */
  post<T>(endpoint: string, body: unknown, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, options);
  }

  /**
   * Effectue une requête PUT.
   * @param endpoint Endpoint relatif à l'API.
   * @param body Corps de la requête.
   * @param options Options HTTP optionnelles.
   * @returns Observable de la réponse.
   */
  put<T>(endpoint: string, body: unknown, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, body, options);
  }

  /**
   * Effectue une requête DELETE.
   * @param endpoint Endpoint relatif à l'API.
   * @param options Options HTTP optionnelles.
   * @returns Observable de la réponse.
   */
  delete<T>(endpoint: string, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, options);
  }
}

