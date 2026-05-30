import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Ramschema } from './pages/ramschema/ramschema';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'ramschema', component: Ramschema },
  { path: '**', component: Home }
];
