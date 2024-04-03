import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedRequest } from '../types/request.model';

@Injectable({
  providedIn: 'root'
})
export class StoreDataService {
  url = 'http://localhost:8000/stores';
  constructor(private http: HttpClient) { }

  getStoreData(pagination: PaginatedRequest) {
    return this.http.get(`${this.url}?page=${pagination.page}&pageSize=${pagination.pageSize}`);
  }
}
