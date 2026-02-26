import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../interfaces/empleado';

// Importaciones para Excel y PDF
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './lista-empleados.component.html',
  styleUrl: './lista-empleados.component.css'
})
export class ListaEmpleadosComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private router = inject(Router);

  empleados = signal<Empleado[]>([]);

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.empleadoService.obtenerEmpleados().subscribe({
      next: (data) => this.empleados.set(data),
      error: (err) => console.error(err)
    });
  }

  // Acción del botón Editar
  confirmarEditar(empleado: Empleado) {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas editar la información de ${empleado.nombre}?`);

    if (confirmacion) {
      // Si el usuario da "Aceptar", lo mandamos a la sub-página de edición
      console.log('Navegando a la página de edición...');
      this.router.navigate(['/editar', empleado.id]);
    }
  }

  // Acción del botón Eliminar (Baja Lógica)
  confirmarEliminar(empleado: Empleado) {
    const confirmacion = window.confirm(`¡Atención! ¿Estás seguro de que deseas dar de baja a ${empleado.nombre}?`);

    if (confirmacion && empleado.id) {
      this.empleadoService.eliminarEmpleado(empleado.id).subscribe({
        next: (respuesta) => {
          console.log(respuesta);
          this.cargarEmpleados();
        },
        error: (err) => console.error('Error al intentar eliminar', err)
      });
    }
  }

  exportarExcel() {
    // 1. Limpiamos los datos para que no salga la columna de IDs internos de la BD en el Excel
    const datosLimpios = this.empleados().map(emp => ({
      'ID': emp.id,
      'Nombre Completo': emp.nombre,
      'Correo Electrónico': emp.correo,
      'Departamento': emp.departamento,
      'Puesto': emp.puesto,
      'Fecha de Registro': emp.fecha_registro
    }));

    // 2. Creamos la hoja de cálculo
    const hoja = XLSX.utils.json_to_sheet(datosLimpios);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Empleados');

    // 3. Descargamos el archivo
    XLSX.writeFile(libro, 'Reporte_Empleados.xlsx');
  }

  exportarPDF() {
    // 1. Creamos un documento PDF en orientación horizontal ('l' de landscape)
    const doc = new jsPDF('l', 'mm', 'a4');

    // 2. Título del PDF
    doc.text('Reporte de Empleados Activos', 14, 15);

    // 3. Preparamos los datos para la tabla del PDF
    const datosTabla = this.empleados().map(emp => [
      emp.id ?? '',
      emp.nombre?? '',
      emp.correo?? '',
      emp.departamento?? '',
      emp.puesto?? '',
      emp.fecha_registro?? ''
    ]);

    // Dibujamos la tabla
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Nombre', 'Correo', 'Departamento', 'Puesto', 'Registro']],
      body: datosTabla,
      theme: 'grid',
      headStyles: { fillColor: [2, 132, 199] } // Un color azulito coqueto para el encabezado
    });

    // 5. Descargamos el PDF
    doc.save('Reporte_Empleados.pdf');
  }


}
