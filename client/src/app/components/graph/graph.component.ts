import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StoreDataService } from '../../services/store-data-service';

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
  defaultPagination = {
    page: 1,
    pageSize: 10
  };

  constructor(private storeService: StoreDataService) {
    this.get();
  }

  get() {
    const data = this.storeService.getStoreData(this.defaultPagination).subscribe(data => {
      console.log(data);
    })
  }

}
