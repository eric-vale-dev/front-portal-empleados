import { Routes } from '@angular/router';
import { ListaEmpleadosComponent } from './components/lista-empleados/lista-empleados.component';
import { EmpleadoFormComponent } from './components/empleado-form/empleado-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  // Pantalla de inicio
  {path: '', component: DashboardComponent},
  {path: 'lista', component: ListaEmpleadosComponent},
  {path: 'agregar', component: EmpleadoFormComponent},
  {path: 'editar/:id', component: EmpleadoFormComponent},
  // si escriben una ruta falsa, regresan al Dashboard
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
