import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StoreDataService } from '../../services/store-data-service';
import { Store } from '../../types/store.model';
import { Chart, LinearScale, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Subject, debounce, debounceTime } from 'rxjs';

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
  private graphData = signal<Store[]>([]);
  private pagination = {
    page: 1,
    page_size: 50
  };

  private chart: Chart | null = null;

  private nextPage$ = new Subject<void>();
  private nextPageSubscription$: any;



  constructor(private storeService: StoreDataService) {
    this.get();
    this.setupNextPageSubscription();
  }

  get() {
    this.storeService.getStoreData(this.pagination)
    .pipe(
      debounceTime(500)
    )
    .subscribe(data => {
      if (this.chart) {

        this.chart.data.datasets[0].data.push(...data.stores.map(store => store.temperature));
        this.chart.data.datasets[1].data.push(...data.stores.map(store => store.cpi));
        this.chart.data.datasets[2].data.push(...data.stores.map(store => store.fuel_price));
        this.chart.data.datasets[3].data.push(...data.stores.map(store => store.unemployment));
        // @ts-ignore
        this.chart.data.labels.push(...data.stores.map(store => store.date));

        this.chart.update('none');
      } else {
        this.graphData.set(data.stores);
        this.initChart();
      }
    })
  }

  setupNextPageSubscription() {
    this.nextPageSubscription$ = this.nextPage$.pipe(
      debounceTime(200)
    ).subscribe(() => {
      this.pagination.page++;
      this.get();
    });
  }

  initChart(initialData: Store[] = []) {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const labels = this.graphData().map(data => data.date);

    this.chart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
          label: 'Temperature',
          data: this.graphData().map(data => data.temperature),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
          },
          {
          label: 'CPI',
          data: this.graphData().map(data => data.cpi),
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
          },
          {
          label: 'Fuel Price',
          data: this.graphData().map(data => data.fuel_price),
          fill: false,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
          },
          {
          label: 'Unemployment',
          data: this.graphData().map(data => data.unemployment),
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
              mode: 'x',
              onPan: ({chart}) => {
                this.nextPage$.next()
              }
            },
            zoom: {
              // onZoomStart: ({chart}) => {
              //   this.nextPage$.next()
              // },
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

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.nextPageSubscription$.unsubscribe();
  }
}
