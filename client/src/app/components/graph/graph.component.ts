import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StoreDataService } from '../../services/store-data-service';
import { Observable } from 'rxjs';
import { PaginatedRequest } from '../../types/request.model';
import { Store, StoreResponse } from '../../types/store.model';

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
  graphData: Store[] = [];
  defaultPagination = {
    page: 1,
    pageSize: 10
  };

  constructor(private storeService: StoreDataService) {
    this.get();
  }

  get() {
    this.storeService.getStoreData(this.defaultPagination).subscribe(data => {
      this.graphData = data.stores;
    })
  }

}
