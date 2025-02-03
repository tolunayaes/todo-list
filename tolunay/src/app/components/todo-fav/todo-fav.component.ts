import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-todo-fav',
  standalone: true,
  imports: [NgFor, MatIconModule, MatButtonModule],
  templateUrl: './todo-fav.component.html',
  styleUrl: './todo-fav.component.css'
})
export class TodoFavComponent implements OnInit {
  favorites: Todo[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.favorites = this.todoService.getFavorites();
  }

  removeFromFavorites(todoId: number) {
    this.todoService.removeFromFavorites(todoId);
    this.favorites = this.todoService.getFavorites();
  }
}
