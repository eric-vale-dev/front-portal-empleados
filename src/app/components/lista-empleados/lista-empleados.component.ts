import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../interfaces/empleado';

//Importaciones para exportar a PDF y Excel
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './lista-empleados.component.html',
  styleUrl: './lista-empleados.component.css'
})
export class ListaEmpleadosComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private router = inject(Router);

  empleados = signal<Empleado[]>([]);
  // Nueva bandera para saber qué vista estamos mostrando
  viendoInactivos = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarDatos();
  }

  // Aquí decidimos que vista cargar
  cargarDatos() {
    if (this.viendoInactivos()) {
      this.empleadoService.obtenerInactivos().subscribe({
        next: (data) => this.empleados.set(data),
        error: (err) => console.error(err)
      });
    } else {
      this.empleadoService.obtenerEmpleados().subscribe({
        next: (data) => this.empleados.set(data),
        error: (err) => console.error(err)
      });
    }
  }

  // Botón para alternar entre activos e inactivos
  alternarVista() {
    this.viendoInactivos.set(!this.viendoInactivos());
    this.cargarDatos(); // Recargamos la tabla con la nueva vista
  }

  confirmarEditar(empleado: Empleado) {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas editar la información de ${empleado.nombre}?`);
    if (confirmacion) {
      this.router.navigate(['/editar', empleado.id]);
    }
  }

  confirmarEliminar(empleado: Empleado) {
    const confirmacion = window.confirm(`¡Atención! ¿Estás seguro de que deseas dar de baja a ${empleado.nombre}?`);
    if (confirmacion && empleado.id) {
      this.empleadoService.eliminarEmpleado(empleado.id).subscribe({
        next: () => {
          alert('Empleado dado de baja.');
          this.cargarDatos();
        },
        error: (err) => console.error('Error al intentar eliminar', err)
      });
    }
  }

  // Reactivar empleado
  confirmarReactivar(empleado: Empleado) {
    const confirmacion = window.confirm(`¿Deseas reincorporar a ${empleado.nombre} como empleado activo?`);
    if (confirmacion && empleado.id) {
      this.empleadoService.reactivarEmpleado(empleado.id).subscribe({
        next: () => {
          alert('¡Empleado reactivado con éxito!');
          this.cargarDatos(); // Recargamos la tabla para que desaparezca de esta vista
        },
        error: (err) => console.error('Error al intentar reactivar', err)
      });
    }
  }

  exportarExcel() {
    const datosLimpios = this.empleados().map(emp => ({
      'ID': emp.id,
      'Nombre Completo': emp.nombre,
      'Correo Electrónico': emp.correo,
      'Departamento': emp.departamento,
      'Puesto': emp.puesto,
      'Fecha de Registro': emp.fecha_registro
    }));
    const hoja = XLSX.utils.json_to_sheet(datosLimpios);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Empleados');
    XLSX.writeFile(libro, `Reporte_Empleados_${this.viendoInactivos() ? 'Inactivos' : 'Activos'}.xlsx`);
  }

  exportarPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.text(this.viendoInactivos() ? 'Reporte de Empleados Inactivos' : 'Reporte de Empleados Activos', 14, 15);
    const datosTabla = this.empleados().map(emp => [
      emp.id ?? '', emp.nombre ?? '',
      emp.correo ?? '', emp.departamento ?? '',
      emp.puesto ?? '', emp.fecha_registro ?? ''
    ]);
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Nombre', 'Correo', 'Departamento', 'Puesto', 'Registro']],
      body: datosTabla,
      theme: 'grid',
      headStyles: { fillColor: this.viendoInactivos() ? [220, 53, 69] : [2, 132, 199] }
    });
    doc.save(`Reporte_Empleados_${this.viendoInactivos() ? 'Inactivos' : 'Activos'}.pdf`);
  }
}
