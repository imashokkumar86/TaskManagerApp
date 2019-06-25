import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import { ParentTaskDetail } from '../models/ParentTask-detail';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class ParentTaskService {
    baseUrl: string = "http://localhost:5000/api/ParentTaskDetail/";
    constructor(private http: Http) {

    }
    private extractData(response: Response) {
        if (response.status < 200 || response.status >= 300) {
            throw new Error('Bad response code: ' + response.status);
        }
        let body = response.json();

        return body || {};
    };
    GetParentList(): Observable<ParentTaskDetail[]> {
        return this.http.get(this.baseUrl).map((data: Response) => <ParentTaskDetail[]>data.json());
    };

    GetAllTasks(): Observable<ParentTaskDetail[]> {
        console.log('calling task api end point');
        return this.http.get(this.baseUrl).map((data: Response) => <ParentTaskDetail[]>data.json());
    };

    GetTask(Id: number): Observable<ParentTaskDetail> {
        return this.http.get(this.baseUrl + Id).map((data: Response) => <ParentTaskDetail>data.json())
    };

    AddTask(Item: ParentTaskDetail): Observable<string> {
        return this.http.post(this.baseUrl, Item)
            .map((data: Response) => <string>data.json())
    };

    PutTask(Item: ParentTaskDetail, Id: number): Observable<string> {
        return this.http.put(this.baseUrl + Id, Item)
            .map((data: Response) => <string>data.json())
    };
}
