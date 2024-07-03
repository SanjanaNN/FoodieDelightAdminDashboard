import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  url = "http://localhost:3000/restaurants";
  constructor(private http: HttpClient) { }

  addRestaurant(data: any): Observable<any> {
    return this.http.post<any>(this.url, data);
  }

  getAllRestaurants() {
    let params = new HttpParams();
    return this.http.get<any>(this.url, { params })
      .pipe(catchError(this.handleError()));
  }

  updateRestaurant(id: string, data: any): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.put<any>(url, data);
  }

  deleteRestaurantById(id: string): Observable<any> {
    const url = `${this.url}/${id}`;
    return this.http.delete<any>(url);
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  private log(message: string) {
    console.log(message);
  }
}
