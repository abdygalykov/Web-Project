import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Transaction } from '../models/transaction';
import { CategoryService } from './category';
import { AuthService } from './auth';
import { API_BASE_URL } from './api';


type TransactionWithCategory = Transaction & {
  category_name: string;
  category_icon: string;
  category_color: string;
};

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private catService = inject(CategoryService);
  private _transactions = signal<Transaction[]>([]);

  transactions = this._transactions.asReadonly();

  totalIncome = computed(() =>
    this._transactions().filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  );

  totalExpense = computed(() =>
    this._transactions().filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  );

  balance = computed(() => this.totalIncome() - this.totalExpense());

  constructor() {
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.load().subscribe();
      } else {
        this._transactions.set([]);
      }
    });
  }

  load(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${API_BASE_URL}/transactions/`).pipe(
      map(transactions => transactions.map(transaction => this.normalize(transaction))),
      tap(transactions => this._transactions.set(transactions)),
      catchError(() => {
        this._transactions.set([]);
        return of([]);
      }),
    );
  }

  getAll(): Transaction[] {
    return this._transactions();
  }

  getWithCategory(): TransactionWithCategory[] {
    return this._transactions().map(t => {
      const cat = this.catService.getById(t.category_id);
      return {
        ...t,
        category_name: t.category_name || cat?.name || 'No category',
        category_icon: t.category_icon || cat?.icon || '❓',
        category_color: t.category_color || cat?.color || '#94a3b8',
      };
    });
  }

  add(t: Omit<Transaction, 'id' | 'created_at'>): Observable<Transaction | null> {
    return this.http.post<Transaction>(`${API_BASE_URL}/transactions/`, t).pipe(
      map(transaction => this.normalize(transaction)),
      tap(transaction => this._transactions.update(all => [transaction, ...all])),
      catchError(() => of(null)),
    );
  }

  update(t: Transaction): Observable<Transaction | null> {
    return this.http.put<Transaction>(`${API_BASE_URL}/transactions/${t.id}/`, t).pipe(
      map(transaction => this.normalize(transaction)),
      tap(transaction => this._transactions.update(all => all.map(item => item.id === t.id ? transaction : item))),
      catchError(() => of(null)),
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete(`${API_BASE_URL}/transactions/${id}/`).pipe(
      map(() => true),
      tap(() => this._transactions.update(all => all.filter(t => t.id !== id))),
      catchError(() => of(false)),
    );
  }

  getByMonth(year: number, month: number): Transaction[] {
    return this._transactions().filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }

  getExpenseByCategory(year: number, month: number): { category_id: number; name: string; icon: string; color: string; total: number }[] {
    const txns = this.getByMonth(year, month).filter(t => t.type === 'expense');
    const totals = new Map<number, number>();
    txns.forEach(t => totals.set(t.category_id, (totals.get(t.category_id) ?? 0) + t.amount));
    return Array.from(totals.entries()).map(([categoryId, total]) => {
      const category = this.catService.getById(categoryId);
      return {
        category_id: categoryId,
        name: category?.name ?? '?',
        icon: category?.icon ?? '?',
        color: category?.color ?? '#999',
        total,
      };
    }).sort((a, b) => b.total - a.total);
  }

  private normalize(transaction: Transaction): Transaction {
    return {
      ...transaction,
      amount: Number(transaction.amount),
    };
  }
}
