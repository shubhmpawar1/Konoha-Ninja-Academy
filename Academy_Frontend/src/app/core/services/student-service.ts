import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number;
  name: string;
  jutsu_type?: string;
  chakra_type?: string;
  signature_jutsu?: string;
  summon_type?: string;
  instructor_id: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StudentCounts {
  total_students: number;
  active_students: number;
  disabled_students: number;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly API_URL = 'http://localhost:7777/api';

  constructor(private http: HttpClient) { }

  getStudentCounts(): Observable<StudentCounts> {
    return this.http.get<StudentCounts>(`${this.API_URL}/students/count`);
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.API_URL}/students`);
  }

  addStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Observable<Student> {
    return this.http.post<Student>(`${this.API_URL}/students`, student);
  }

  updateStudent(id: number, student: Partial<Omit<Student, 'id'>>): Observable<Student> {
    return this.http.put<Student>(`${this.API_URL}/students/${id}`, student);
  }

  disableStudent(id: number): Observable<Student> {
    return this.http.post<Student>(`${this.API_URL}/students/${id}/disable`, {});
  }

  enableStudent(id: number): Observable<Student> {
    return this.http.post<Student>(`${this.API_URL}/students/${id}/enable`, {});
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete<Student>(`${this.API_URL}/students/${id}`); // your backend route
  }


}
