import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import { TaskDetail } from '../models/task-detail';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

const USER: any = { "userId": 1, "firstName": "User 1", "lastName": "", "employeeId": 10 };
const PROJECT: any = {
  "projectId": 1, "projectName": "Project 1",
  "startDate": "2019-04-23", "endDate": "2019-04-28", "priority": 10, "userId": 1, "activeStatus": true,
  "userDetail": USER
};

const taskDetails: any[] = [{
  "id": 1, "name": "Task 1", "priority": 10,
  "activeStatus": true, "parentId": 2, "parentName": "parent", "userDetail": USER, "projectDetail": PROJECT
},
{
  "id": 2, "name": "Task 2", "priority": 10,
  "activeStatus": false, "parentId": 2, "parentName": "parent", "userDetail": USER, "projectDetail": PROJECT
}
];

const TASK_DETAIL: TaskDetail = new TaskDetail();
export class MockTaskService {
  public GetAllTasks(): Observable<TaskDetail[]> {
    return Observable.of(taskDetails);
  }

  public GetParentList(): Observable<TaskDetail[]> {
    return Observable.of(taskDetails);
  }

  public GetTask(): Observable<TaskDetail> {
    return Observable.of(taskDetails[0]);
  }

  public AddTask(Item: TaskDetail): Observable<string> {
    return Observable.of("Success");
  }

  public PutTask(Item: TaskDetail, Id: number): Observable<string> {
    return Observable.of("Success");
  }
}
