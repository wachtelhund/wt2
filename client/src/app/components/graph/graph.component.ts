import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StoreDataService } from '../../services/store-data-service';
import { Store } from '../../types/store.model';
import { Chart, LinearScale, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { BehaviorSubject, Subject, debounceTime } from 'rxjs';
import { StorePickerComponent } from './components/store-picker/store-picker.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PaginatedRequest } from '../../types/request.model';
import { FilterKeys } from '../../types/filter.model';
import annotationPlugin from 'chartjs-plugin-annotation';
import { AnnotationOptions } from 'chartjs-plugin-annotation';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

Chart.register(LinearScale, zoomPlugin, annotationPlugin, ...registerables);

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    StorePickerComponent,
    MatProgressBarModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  providers: [StoreDataService, provideNativeDateAdapter()],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  currentStore: number | null = null;
  graphData = signal<Store[]>([]);
  private pagination: PaginatedRequest = {
    page: 1,
    page_size: 25,
    filter_by: FilterKeys.Store,
    filter_value: "1",
  };

  startDate: Date | null = null;
  endDate: Date | null = null;

  private chart: Chart | null = null;

  private nextPage$ = new Subject<void>();
  private hasNext$ = new BehaviorSubject<boolean>(true);
  private nextPageSubscription$: any;

  loading = true;
  progress = signal<number>(0);

  holidayAnnotations = signal<AnnotationOptions[]>([]);

  constructor(private storeService: StoreDataService) {
    this.get();
    this.setupNextPageSubscription();
  }

  hasSelectedDates() {
    return this.endDate == null;
  }

  onClearDates() {
    this.startDate = null;
    this.endDate = null;
    delete this.pagination.from_date;
    delete this.pagination.to_date;
    this.pagination.page_size = 25;
    this.clearGraph();
  }

  onDateEnd(event: any) {
    if (this.startDate && this.endDate) {
      this.pagination.from_date = new Date(this.startDate).toISOString()
      this.pagination.to_date = new Date(this.endDate).toISOString()
      this.pagination.page_size = 50;
      this.clearGraph();
    }
  }

  setStore(store: number) {
    this.pagination.filter_value = store.toString();
    this.currentStore = store;
    this.clearGraph();
  }

  clearGraph() {
    this.hasNext$.next(true);
    this.pagination.page = 1;
    this.graphData.set([]);
    this.chart?.destroy();
    this.chart = null;
    this.get();
  }

  get() {
    if (this.hasNext$.value === false) {
      return;
    }

    this.loading = true;
    this.storeService.getStoreData(this.pagination)
    .pipe(
      debounceTime(50)
    )
    .subscribe(data => {
      this.hasNext$.next(data.has_next);
      if (this.chart) {
        this.chart.data.datasets[0].data.push(...data.stores.map(store => store.temperature));
        this.chart.data.datasets[1].data.push(...data.stores.map(store => store.cpi));
        this.chart.data.datasets[2].data.push(...data.stores.map(store => store.fuel_price));
        this.chart.data.datasets[3].data.push(...data.stores.map(store => store.unemployment));
        this.chart.data.datasets[4].data.push(...data.stores.map(store => store.weekly_sales / 10000));


        // @ts-ignore
        this.chart.data.labels.push(...data.stores.map(store => store.date));
        this.graphData.set([...this.graphData(), ...data.stores]);

        this.updateChartAnnotations();

        this.chart.update('none');
      } else {
        this.graphData.set(data.stores);
        this.initChart();
      }
      
      this.loading = false;
      this.progress.set(this.graphData().length / data.count * 100);
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

  updateChartAnnotations() {
    const newAnnotations = this.graphData().reduce((annotations, data, index) => {
      if (data.holiday_flag === 1) {
        annotations.push({
          type: 'box',
          xMin: index - 0.5,
          xMax: index + 0.5,
          backgroundColor: 'rgba(255, 99, 132, 0.25)',
          borderWidth: 0
        });
      }
      return annotations;
    }, [] as AnnotationOptions[]);

    if (this.chart && this.chart.options && this.chart.options.plugins && this.chart.options.plugins.annotation) {
      this.chart.options.plugins.annotation.annotations = newAnnotations;
    }
  }


  initChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const labels = this.graphData().map(data => data.date);

    this.holidayAnnotations.set(this.graphData().reduce((annotations, data, index) => {
      if (data.holiday_flag === 1) {
        annotations.push({
          type: 'box',
          xMin: index - 0.5,
          xMax: index + 0.5,
          backgroundColor: 'rgba(255, 99, 132, 0.25)',
          borderWidth: 0
        });
      }
      return annotations;
    }, [] as AnnotationOptions[]));

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
          },
          {
          label: 'Weekly Sales (10000$)',
          data: this.graphData().map(data => data.weekly_sales / 10000),
          fill: false,
          borderColor: 'rgb(153, 102, 255)',
          tension: 0.1
          },
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        },
        plugins: {
          annotation: {
            annotations: this.holidayAnnotations()
          },
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
              mode: 'x',
              onZoom: ({chart}) => {
                this.nextPage$.next()
              }
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
