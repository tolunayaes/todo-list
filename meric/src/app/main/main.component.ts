import { CommonModule } from '@angular/common';
import {Component} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'main-component',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, MatSlideToggleModule, MatIconModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {
  todoList: any[] = [];
  editList: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTodos();
  }

  getTodos() {
    this.http.get("https://dummyjson.com/todos/user/1").subscribe((res:any) => {
      this.todoList = res.todos;
      this.editList = this.todoList.reduce((acc, item) => {
        acc[item.id] = {
          editable: false,
          editedText: item.todo,
          completed: item.completed
        };
        return acc;
      }, {});
    });
  }

  deleteTodo(id: any) {
    this.http.delete(`https://dummyjson.com/todos/${id}`).subscribe((response:any) => {
      console.log(response, 'delete response');
      alert("Todo was deleted.");
      this.getTodos();
    });
  }

  openEdit(id: any) {
    this.editList[id].editable = true;
  }

  cancelEdit(id: any) {
    this.editList[id].editable = false;
  }


  editTodo(id: any) {
    let editedTodoTemplate = {
      todo: this.editList[id].editedText,
    };

    this.http.put<any>(`https://dummyjson.com/todos/${id}`, editedTodoTemplate).subscribe((response:any) => {
      if (response) {
        console.log(response, "update response");
        alert("Todo was editted.");
        this.getTodos();
      } else {
        console.log(response, "fail");
      }
    });
  }

  changeStatus(id: any) {
    let editedTodoTemplate = {
      completed: !this.editList[id].completed,
    };

    this.http.put<any>(`https://dummyjson.com/todos/${id}`, editedTodoTemplate).subscribe((response:any) => {
      if (response) {
        console.log(response, "update response");
        alert("Todo status was updated.");
        this.getTodos();
      } else {
        console.log(response, "fail");
      }
    });
  }
}
