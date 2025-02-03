import { Component, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NgClass, DatePipe, NgFor } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  imports: [
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    NgClass,
    DatePipe,
    NgFor,
  ],
  standalone: true,
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];

  constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    console.log('ngOnInit is running');
    this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
    });
  }

  onTodoChange(todo: Todo) {
    this.todoService.updateTodo(todo).subscribe(() => {
      const message = todo.completed
        ? 'Task completed!'
        : 'Task marked as incomplete';
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    });
  }

  addToFavorites(todo: Todo) {
    todo.isFavorite = !todo.isFavorite;
    this.todoService.addToFavorites(todo);

    const message = todo.isFavorite
      ? 'Task added to favorites! 🎉'
      : 'Task removed from favorites!';
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe(() => {
      this.snackBar.open('Task deleted successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    });
  }
}
