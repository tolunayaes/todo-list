import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../models/todo.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface DummyTodoResponse {
  todos: Array<{
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
  }>;
  total: number;
  skip: number;
  limit: number;
}

interface DeleteTodoResponse {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  isDeleted: boolean;
  deletedOn: string;
}

interface AddTodoResponse {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'https://dummyjson.com/todos';
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();
  private favorites: Todo[] = [];

  constructor(private http: HttpClient) {
    this.fetchTodos();
  }

  private fetchTodos() {
    console.log('Fetching todos...');
    this.http.get<DummyTodoResponse>(this.apiUrl).pipe(
      tap(response => console.log('API Response:', response)),
      map(response => response.todos.map(todo => ({
        id: todo.id,
        title: todo.todo,
        completed: todo.completed,
        date: new Date(),
        isFavorite: false
      })))
    ).subscribe({
      next: (todos) => {
        console.log('Processed todos:', todos);
        this.todosSubject.next(todos);
      },
      error: (error) => {
        console.error('Error fetching todos:', error);
      }
    });
  }

  getTodos(): Observable<Todo[]> {
    return this.todos$;
  }

  addTodo(todo: Todo) {
    console.log('Adding todo:', todo);
    return this.http.post<AddTodoResponse>(`${this.apiUrl}/add`, {
      todo: todo.title,
      completed: false,
      userId: 5
    }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap({
        next: response => {
          console.log('Add todo response:', response);
          const newTodo = {
            id: response.id,
            title: response.todo,
            completed: response.completed,
            date: new Date(),
            isFavorite: false
          };
          this.todosSubject.next([newTodo, ...this.todosSubject.getValue()]);
        },
        error: error => console.error('Error adding todo:', error)
      })
    );
  }

  updateTodo(todo: Todo) {
    return this.http.put<any>(`${this.apiUrl}/${todo.id}`, {
      completed: todo.completed
    }).pipe(
      tap(() => {
        const todos = this.todosSubject.getValue();
        const index = todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          todos[index] = todo;
          this.todosSubject.next([...todos]);
        }
      })
    );
  }

  deleteTodo(todoId: number) {
    console.log('Deleting todo:', todoId);
    return this.http.delete<DeleteTodoResponse>(`${this.apiUrl}/${todoId}`).pipe(
      tap({
        next: response => {
          console.log('Delete response:', response);
          if (response.isDeleted) {
            const todos = this.todosSubject.getValue().filter(t => t.id !== todoId);
            this.todosSubject.next(todos);
          }
        },
        error: error => console.error('Error deleting todo:', error)
      })
    );
  }

  getFavorites(): Todo[] {
    return this.favorites;
  }

  addToFavorites(todo: Todo) {
    if (!this.favorites.find(f => f.id === todo.id)) {
      this.favorites.push(todo);
    }
  }

  removeFromFavorites(todoId: number) {
    this.favorites = this.favorites.filter(todo => todo.id !== todoId);
  }
}