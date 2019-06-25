import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TaskDetail } from '../../models/task-detail';
import { ParentTaskDetail } from '../../models/ParentTask-detail';
import { ParentTaskService } from '../../SharedService/Parent.service';
import { TaskService } from '../../SharedService/task.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-taskmgr-view',
  templateUrl: './taskmgr-view.component.html',
  styleUrls: ['./taskmgr-view.component.css']
})
export class TaskmgrViewComponent implements OnInit {

  @ViewChild('showmodalClick') showmodalClick: ElementRef;
  taskDetails: TaskDetail[] = [];
  public taskDetailsFiltered: TaskDetail[] = [];
  public parentTaskDetails: ParentTaskDetail[];
  public parentTaskDetail: ParentTaskDetail;
  projectSearch: string;
  
  nameSearch: string;
  parentTaskSearch: string;
  priorityFromSearch: number;
  priorityToSearch: number;
  startDateSearch: string;
  endDateSearch: string;
  taskDetail: TaskDetail;
  results: string;
  showError: boolean;
 
  path: string[] = ['startDate'];
  order: number = 1; // 1 asc, -1 desc;

  constructor(private taskservice: TaskService,  private parentTaskManagerService:ParentTaskService,
    private router: Router, private location: Location) { }

  ngOnInit() {
    this.parentTaskDetail = new ParentTaskDetail();
    this.onGetAllParentTask();
    this.onGetAllTask();

  }
  onGetAllParentTask() {
    this.parentTaskManagerService.GetParentList().subscribe(
      response => this.parentTaskDetails = response);
  }
  onGetAllTask() {
    this.taskservice.GetAllTasks().subscribe(
      response => this.taskDetailsFiltered = response);
  }
   edit(taskId) {
    this.router.navigate(['/editTask'], { queryParams: { id: taskId } });
  }
getParentTaskName(id){

  var desc=this.parentTaskDetails.filter(x => x.parentId == id)[0].parentTask;
  return desc;
}
  sortTask(prop: string) {
    this.path = prop.split('.')
    this.order = this.order * (-1); // change order
    return false; // do not reload
  }

  endTask(taskId) {

    this.taskDetail = this.taskDetailsFiltered.find(taskElement => taskElement.id == taskId);
    this.taskDetail.activeStatus = false;
    this.taskservice.PutTask(this.taskDetail, this.taskDetail.id).subscribe(response => {
      if (response.length > 0) {
        this.results = this.taskDetail.name + " has been closed successfully.";
      }
      console.log("result text:" + this.results);
    },
      error => {
        if (error.status < 200 || error.status > 300) {
          this.taskDetail.activeStatus = true;
          this.results = error.statusText + "-" + JSON.parse(error._body);
        }
        console.log("error " + JSON.parse(error._body));
      }
    );
  }
  closeModal() {
    
  }
}
