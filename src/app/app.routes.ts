import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { Ramschema } from './components/pages/ramschema/ramschema';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'ramschema', component: Ramschema },
  { path: '**', redirectTo: '' }
];