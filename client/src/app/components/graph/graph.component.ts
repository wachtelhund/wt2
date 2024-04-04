import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StoreDataService } from '../../services/store-data-service';
import { Store } from '../../types/store.model';
import { Chart, LinearScale, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Subject, debounce, debounceTime, tap } from 'rxjs';
import { StorePickerComponent } from './components/store-picker/store-picker.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PaginatedRequest } from '../../types/request.model';
import { FilterKeys } from '../../types/filter.model';

Chart.register(LinearScale, zoomPlugin, ...registerables);

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    StorePickerComponent,
    MatProgressBarModule
  ],
  providers: [StoreDataService],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  currentStore: number | null = null;
  private graphData = signal<Store[]>([]);
  private pagination: PaginatedRequest = {
    page: 1,
    page_size: 50,
    filter_by: FilterKeys.Store,
    filter_value: "1"
  };

  private chart: Chart | null = null;

  private nextPage$ = new Subject<void>();
  private nextPageSubscription$: any;

  loading = true;

  constructor(private storeService: StoreDataService) {
    this.get();
    this.setupNextPageSubscription();
  }

  setStore(store: number) {
    this.pagination.filter_value = store.toString();
    this.currentStore = store;
    this.clearGraph();
  }

  clearGraph() {
    this.graphData.set([]);
    this.chart?.destroy();
    this.chart = null;
    this.get();
  }

  get() {
    this.loading = true;
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
      this.loading = false;
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

  initChart() {
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
