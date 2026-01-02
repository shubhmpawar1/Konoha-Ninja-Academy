import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InstructorCounts {
  total_instructors: number;
  active_instructors: number;
  disabled_instructors: number;
}
export interface Instructor {
  id: number;
  name: string;
  jutsu_type: string;
  chakra_type?: string;
  signature_jutsu?: string;
  summon_type?: string;
  is_active: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse {
  data: Instructor[];
  pagination: PaginationMeta;
}

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private readonly API_URL = 'http://localhost:7777/api';
  constructor(private http: HttpClient) { }
  getInstructorCounts(): Observable<InstructorCounts> {
    return this.http.get<InstructorCounts>(`${this.API_URL}/instructors/count`);
  }
  getAllInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.API_URL}/instructors`);
  }
  getPaginatedInstructors(page: number = 1, limit: number = 5): Observable<PaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse>(`${this.API_URL}/paginated`, { params });
  }
  addInstructor(instructor: Omit<Instructor, 'id'>): Observable<Instructor> {
    return this.http.post<Instructor>(`${this.API_URL}/instructors`, instructor);
  }
  updateInstructor(id: number, instructor: Partial<Omit<Instructor, 'id'>>): Observable<Instructor> {
    return this.http.put<Instructor>(`${this.API_URL}/instructors/${id}`, instructor);
  }
  disableInstructor(id: number): Observable<Instructor> {
    return this.http.post<Instructor>(`${this.API_URL}/instructors/${id}/disable`, {});
  }
  enableInstructor(id: number): Observable<Instructor> {
    return this.http.patch<Instructor>(`${this.API_URL}/instructors/${id}/enable`, {});
  }
  deleteInstructor(id: number): Observable<Instructor> {
    return this.http.delete<Instructor>(`${this.API_URL}/instructors/${id}`);
  }

}
