import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-add',
  imports: [MatInputModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  newTodo: string | undefined;

  constructor(private http: HttpClient) {}

  createTodo() {
    let newTodoTemplate = {
      todo: this.newTodo,
      completed: false,
      userId: 1,
    };

    this.http.post<any>("https://dummyjson.com/todos/add", newTodoTemplate).subscribe((response:any) => {
      if(response) {
        console.log(response, "create response");
        alert("Todo was added.");
      } else {
        console.log(response, "fail");
      }
    });
  }
}
