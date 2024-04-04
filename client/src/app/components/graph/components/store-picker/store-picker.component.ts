import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { StoreDataService } from '../../../../services/store-data-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-store-picker',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './store-picker.component.html',
  styleUrl: './store-picker.component.scss'
})
export class StorePickerComponent {
  menuItems = signal<number[]>([]);
  currentStore = 1;
  @Output() selected = new EventEmitter<number>();

  constructor(private storeService: StoreDataService) {
    this.getStoreIds();
  }

  getStoreIds() {
    this.storeService.getStoreIds().subscribe(data => {
      this.menuItems.set(data.store_ids);
    });
  }

  onItemSelected(store: number) {
    this.currentStore = store;
    this.selected.emit(store);
  }

}
