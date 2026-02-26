import { Component, OnInit, signal, inject } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);

  datosDashboard = signal<any>({
    kpis: { total: 0, activos: 0, inactivos: 0 },
    ultimos: [],
    grafica: []
  });

  chart: any = null;

  ngOnInit(): void {
    this.empleadoService.obtenerDashboard().subscribe({
      next: (data) => {
        this.datosDashboard.set(data);
        this.renderizarGrafica(data.grafica);
      },
      error: (err) => {
        console.error('Error al cargar el dashboard', err);
        alert('Error de conexión con la base de datos. Revisa la consola.');
      }
    });
  }

  renderizarGrafica(datosGrafica: any[]) {
    // Protección anti-crash
    if (!datosGrafica || datosGrafica.length === 0) {
      console.warn('No hay datos para graficar');
      return;
    }

    setTimeout(() => {
      if (this.chart) {
        this.chart.destroy();
      }

      const lienzo = document.getElementById('canvasPastel') as HTMLCanvasElement;
      if (!lienzo) return;

      const nombres = datosGrafica.map(item => item.departamento);
      const cantidades = datosGrafica.map(item => item.cantidad);

      this.chart = new Chart(lienzo, {
        type: 'pie',
        data: {
          labels: nombres,
          datasets: [{
            data: cantidades,
            backgroundColor: ['#0284c7', '#16a34a', '#dc2626', '#f59e0b', '#8b5cf6'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }, 50);
  }
}
