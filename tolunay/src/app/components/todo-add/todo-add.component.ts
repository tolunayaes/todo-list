import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-add',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './todo-add.component.html',
})
export class TodoAddComponent {
  newTodoTitle = '';

  constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {}

  addTodo() {
    if (this.newTodoTitle.trim()) {
      const newTodo = {
        id: 0,
        title: this.newTodoTitle,
        completed: false,
        date: new Date(),
        isFavorite: false,
      };

      this.todoService.addTodo(newTodo).subscribe(() => {
        this.newTodoTitle = '';
        this.snackBar.open('Task added successfully! ✨', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      });
    }
  }
}
