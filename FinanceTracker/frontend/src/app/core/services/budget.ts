import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Budget } from '../models/budget';
import { AuthService } from './auth';
import { API_BASE_URL } from './api';


@Injectable({ providedIn: 'root' })
export class BudgetService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private _budgets = signal<Budget[]>([]);

  budgets = this._budgets.asReadonly();

  constructor() {
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.load().subscribe();
      } else {
        this._budgets.set([]);
      }
    });
  }

  load(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${API_BASE_URL}/budgets/`).pipe(
      map(budgets => budgets.map(budget => this.normalize(budget))),
      tap(budgets => this._budgets.set(budgets)),
      catchError(() => {
        this._budgets.set([]);
        return of([]);
      }),
    );
  }

  getAll(): Budget[] {
    return this._budgets();
  }

  getCurrentMonth(): Budget[] {
    const now = new Date();
    return this._budgets().filter(b => b.month === now.getMonth() && b.year === now.getFullYear());
  }

  add(budget: Omit<Budget, 'id' | 'spent' | 'category_name'>): Observable<Budget | null> {
    return this.http.post<Budget>(`${API_BASE_URL}/budgets/`, budget).pipe(
      map(item => this.normalize(item)),
      tap(item => this._budgets.update(all => [...all, item])),
      catchError(() => of(null)),
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete(`${API_BASE_URL}/budgets/${id}/`).pipe(
      map(() => true),
      tap(() => this._budgets.update(all => all.filter(b => b.id !== id))),
      catchError(() => of(false)),
    );
  }

  private normalize(budget: Budget): Budget {
    return {
      ...budget,
      amount: Number(budget.amount),
      spent: Number(budget.spent),
    };
  }
}
