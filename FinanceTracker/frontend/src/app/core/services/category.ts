import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Category } from '../models/category';
import { AuthService } from './auth';
import { API_BASE_URL } from './api';


@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private _categories = signal<Category[]>([]);

  categories = this._categories.asReadonly();

  constructor() {
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.load().subscribe();
      } else {
        this._categories.set([]);
      }
    });
  }

  load(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_BASE_URL}/categories/`).pipe(
      tap(categories => this._categories.set(categories)),
      catchError(() => {
        this._categories.set([]);
        return of([]);
      }),
    );
  }

  getAll(): Category[] {
    return this._categories();
  }

  getById(id: number): Category | undefined {
    return this._categories().find(c => c.id === id);
  }

  getByType(type: 'income' | 'expense'): Category[] {
    return this._categories().filter(c => c.type === type);
  }

  add(cat: Omit<Category, 'id'>): Observable<Category | null> {
    return this.http.post<Category>(`${API_BASE_URL}/categories/`, cat).pipe(
      tap(category => this._categories.update(all => [...all, category])),
      catchError(() => of(null)),
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete(`${API_BASE_URL}/categories/${id}/`).pipe(
      map(() => true),
      tap(() => this._categories.update(all => all.filter(c => c.id !== id))),
      catchError(() => of(false)),
    );
  }
}
