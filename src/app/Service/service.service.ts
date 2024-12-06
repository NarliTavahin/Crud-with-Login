
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Root } from '../Modals/api-modals';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private _http: HttpClient) {}

  // Get all users
  getUserList(): Observable<Root> {
    return this._http.get<Root>(this.apiUrl);
  }

  // Get a user by ID
  getUserById(id: number): Observable<User> {
    return this._http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Add a new user
  addUser(user: User): Observable<User> {
    return this._http.post<User>(this.apiUrl, user);
  }

  // Update an existing user by ID
  updateUser(id: number, user: User): Observable<User> {
    return this._http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Delete a user by ID
  deleteUser(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
