import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../interfaces/empleado';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private http = inject(HttpClient);
  private urlApi = 'http://localhost:8000'; //URL de tu API

  constructor() { }

  //Método que va a php y pide el listado de empleados
  obtenerEmpleados(): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(`${this.urlApi}/obtener_empleados.php`);
  }

  // Método para eliminar un empleado por ID
  eliminarEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.urlApi}/eliminar_empleado.php?id=${id}`);
  }

  // Traemos los catálogos para los menus
  obtenerCatalogos(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/obtener_catalogos.php`);
  }

  // Traer un solo empleado cuando lo queramos editar
  obtenerEmpleadoPorId(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.urlApi}/obtener_empleado.php?id=${id}`);
  }

  // Dar de alta a un nuevo empleado
  agregarEmpleado(empleado: Empleado): Observable<any> {
    return this.http.post(`${this.urlApi}/agregar_empleado.php`, empleado);
  }

  // Actualizar a un empleado ya existente
  actualizarEmpleado(id: number, empleado: Empleado): Observable<any> {
    return this.http.put(`${this.urlApi}/actualizar_empleado.php?id=${id}`, empleado);
  }

  // Obtener datosresumidos para el dashboard
  obtenerDashboard(): Observable<any>{
    return this.http.get<any>(`${this.urlApi}/obtener_dashboard.php`);
  }
}
