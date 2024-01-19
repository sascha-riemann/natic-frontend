import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateUser, UpdateUser, User } from '../dto/user';
import { UserEndpoints } from '../user.module';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  create(dto: CreateUser): Observable<void> {
    return this.http.post<void>(UserEndpoints.createUser, dto);
  }

  update(dto: UpdateUser): Observable<void> {
    return this.http.post<void>(UserEndpoints.updateUser(dto.id), dto);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(UserEndpoints.getUser(id));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(UserEndpoints.getUsers);
  }

  removeUserFromBusiness(userId: number): Observable<void> {
    return this.http.delete<void>(UserEndpoints.removeFromBusiness(userId));
  }
}
