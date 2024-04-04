import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StoreDataService } from '../../services/store-data-service';
import { Store } from '../../types/store.model';
import { Chart, LinearScale, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(LinearScale, zoomPlugin, ...registerables);

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  providers: [StoreDataService],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  graphData: Store[] = [];
  pagination = {
    page: 1,
    page_size: 50
  };

  constructor(private storeService: StoreDataService) {
    this.get();
  }

  get() {
    this.storeService.getStoreData(this.pagination).subscribe(data => {
      this.graphData = data.stores;
      this.initChart();
    })
  }

  initChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const labels = this.graphData.map(data => data.date);
    const temperatures = this.graphData.map(data => data.temperature);

    new Chart(ctx!, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
          label: 'Temperature',
          data: temperatures,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
          },
          {
          label: 'CPI',
          data: this.graphData.map(data => data.cpi),
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
          },
          {
          label: 'Fuel Price',
          data: this.graphData.map(data => data.fuel_price),
          fill: false,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
          },
          {
          label: 'Unemployment',
          data: this.graphData.map(data => data.unemployment),
          fill: false,
          borderColor: 'rgb(255, 205, 86)',
          tension: 0.1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x'
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'x'
            }
          }
        }
      }
    });
  }
}
