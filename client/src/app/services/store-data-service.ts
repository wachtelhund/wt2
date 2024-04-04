import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedRequest } from '../types/request.model';
import { StoreResponse } from '../types/store.model';

@Injectable({
  providedIn: 'root'
})
export class StoreDataService {
  url = 'http://localhost:8000/stores';
  constructor(private http: HttpClient) { }

  getStoreData(pagination: PaginatedRequest) {
    return this.http.get<StoreResponse>(`${this.url}?page=${pagination.page}&page_size=${pagination.page_size}`);
  }
}
