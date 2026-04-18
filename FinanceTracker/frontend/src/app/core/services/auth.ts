import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { API_BASE_URL } from './api';
import { AuthTokens, LoginRequest, RegisterRequest, User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => !!this.currentUser());

  constructor() {
    if (this.getAccessToken()) {
      const storedUser = this.getStoredUser();
      if (storedUser) {
        this.currentUser.set(storedUser);
      }
      this.fetchCurrentUser().subscribe();
    }
  }

  login(req: LoginRequest): Observable<boolean> {
    return this.http.post<AuthTokens>(`${API_BASE_URL}/auth/login/`, req).pipe(
      tap(tokens => this.storeTokens(tokens)),
      switchMap(() => this.fetchCurrentUser()),
      map(() => true),
      catchError(() => of(false)),
    );
  }

  register(req: RegisterRequest): Observable<boolean> {
    return this.http.post(`${API_BASE_URL}/auth/register/`, req).pipe(
      switchMap(() => this.login({ username: req.username, password: req.password })),
      catchError((error) => {
        console.error('Registration failed', error);
        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('ft_user');
    localStorage.removeItem('ft_access_token');
    localStorage.removeItem('ft_refresh_token');
  }

  fetchCurrentUser(): Observable<User | null> {
    if (!this.getAccessToken()) {
      this.currentUser.set(null);
      return of(null);
    }

    return this.http.get<User>(`${API_BASE_URL}/auth/me/`).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.storeUser(user);
      }),
      map(user => user),
      catchError(() => {
        this.logout();
        return of(null);
      }),
    );
  }

  private getStoredUser(): User | null {
    try {
      const s = localStorage.getItem('ft_user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  }

  private storeUser(u: User): void {
    try { localStorage.setItem('ft_user', JSON.stringify(u)); } catch {}
  }

  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('ft_access_token', tokens.access);
    localStorage.setItem('ft_refresh_token', tokens.refresh);
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('ft_access_token');
  }
}
