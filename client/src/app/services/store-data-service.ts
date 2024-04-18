import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedRequest } from '../types/request.model';
import { StoreIdsResponse, StoreResponse } from '../types/store.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreDataService {
  url = new URL(environment.apiUrl + '/stores');

  constructor(private http: HttpClient) {}

  getStoreData(query: PaginatedRequest) {
    let params = new HttpParams()

    Object.keys(query).forEach(key => {
      const value = query[key as keyof PaginatedRequest];
      if (value) {
        params = params.set(key, value.toString());
      }
    })

    return this.http.get<StoreResponse>(this.url.toString(), { params });
  }

  getStoreIds() {
    return this.http.get<StoreIdsResponse>(this.url + '/ids');
  }
}
