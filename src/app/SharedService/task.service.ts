import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import { TaskDetail } from '../models/task-detail';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class TaskService {
    baseUrl: string = "http://localhost:5000/api/tasks/";
    constructor(private http: Http) {

    }
    private extractData(response: Response) {
        if (response.status < 200 || response.status >= 300) {
            throw new Error('Bad response code: ' + response.status);
        }
        let body = response.json();

        return body || {};
    };
    GetParentList(): Observable<TaskDetail[]> {
        return this.http.get(this.baseUrl).map((data: Response) => <TaskDetail[]>data.json());
    };

    GetAllTasks(): Observable<TaskDetail[]> {
        console.log('calling task api end point');
        return this.http.get(this.baseUrl).map((data: Response) => <TaskDetail[]>data.json());
    };

    GetTask(Id: number): Observable<TaskDetail> {
        return this.http.get(this.baseUrl + Id).map((data: Response) => <TaskDetail>data.json())
    };

    AddTask(Item: TaskDetail): Observable<string> {
        return this.http.post(this.baseUrl, Item)
            .map((data: Response) => <string>data.json())
    };

    PutTask(Item: TaskDetail, Id: number): Observable<string> {
        return this.http.put(this.baseUrl + Id, Item)
            .map((data: Response) => <string>data.json())
    };
}
