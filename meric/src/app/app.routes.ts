import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AddComponent } from './add/add.component';

export const routes: Routes = [
  {
    path: '',
    component:AddComponent
  },
  {
    path: 'list',
    component:MainComponent
  }
];
