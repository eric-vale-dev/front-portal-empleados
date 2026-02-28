import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../interfaces/empleado';
import { Departamento, Puesto } from '../../interfaces/catalogos';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './empleado-form.component.html',
  styleUrl: './empleado-form.component.css'
})
export class EmpleadoFormComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  departamentos = signal<Departamento[]>([]);
  puestos = signal<Puesto[]>([]);

  empleado: Empleado = {
    nombre: '',
    correo: '',
    departamento_id: 0,
    puesto_id: 0
  };

  // Validar que en el nombre solo acepte letras
  soloLetras(event: KeyboardEvent): boolean{
    const pattern = /[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
    return pattern.test(event.key)
  }

  esEdicion = false;

  ngOnInit(): void {

    this.cargarCatalogos();

    // Revisamos si la URL trae un ID
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.esEdicion = true;
      // Vamos a PHP por los datos del empleado y rellenamos el formulario
      this.empleadoService.obtenerEmpleadoPorId(Number(id)).subscribe({
        next: (data) => {
          this.empleado = data;
        },
        error: (err) => {
          console.error('Error al obtener el empleado:', err);
          alert('No se encontró al empleado.');
          this.router.navigate(['/']); // Lo regresamos si hay error
        }
      });
    }
  }

  cargarCatalogos() {
    this.empleadoService.obtenerCatalogos().subscribe({
      next: (data) => {
        this.departamentos.set(data.departamentos);
        this.puestos.set(data.puestos);
      },
      error: (err) => console.error('Error al cargar catálogos', err)
    });
  }

  guardar() {
    if (this.esEdicion && this.empleado.id) {
      // Editar empleado
      this.empleadoService.actualizarEmpleado(this.empleado.id, this.empleado).subscribe({
        next: (respuesta) => {
          console.log(respuesta);
          alert('¡Datos actualizados con éxito!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Hubo un error al actualizar. Verifica si el correo ya está en uso.');
        }
      });
    } else {
      // Agregar nuevo empleado
      this.empleadoService.agregarEmpleado(this.empleado).subscribe({
        next: (respuesta) => {
          console.log(respuesta);
          alert('¡Empleado registrado con éxito!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          alert('Hubo un error al guardar. Verifica si el correo ya está en uso.');
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/']);
  }
}
