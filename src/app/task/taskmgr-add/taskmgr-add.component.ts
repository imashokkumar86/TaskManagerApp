import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { TaskDetail } from '../../models/task-detail';
import { ParentTaskDetail } from '../../models/ParentTask-detail';
import { TaskService } from '../../SharedService/task.service';
import { ParentTaskService } from '../../SharedService/Parent.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-taskmgr-add',
  templateUrl: './taskmgr-add.component.html',
  styleUrls: ['./taskmgr-add.component.css']
})
export class TaskmgrAddComponent implements OnInit {
  @ViewChild('showmodalClick') showmodalClick: ElementRef;
  @ViewChild('showParentTaskCheckbox') showParentTaskCheckbox: ElementRef;
  projectSearch: string;
    public parentTaskDetails: ParentTaskDetail[];
  public taskDetail: TaskDetail;
  public parentTaskDetail: ParentTaskDetail;
  results: string
  isParentTaskSelected: boolean = false;
  userSearch: string;
  managerName: string;
  projectName: string;
  parentTaskName: string;
  parentTaskSearch: string;
  constructor(private taskManagerService: TaskService, private parentTaskManagerService:ParentTaskService,private router: Router) { }

  ngOnInit() {
    this.taskDetail = new TaskDetail();
    this.parentTaskDetail = new ParentTaskDetail();
    this.taskDetail.priority = 0;
    var endDate = new Date();
    endDate.setDate(new Date().getDate() + 1);
    this.taskDetail.startDate = new Date();
    this.taskDetail.endDate = endDate;
    this.taskDetail.activeStatus = true;
  }

  

  onParentTaskSelected(e) {
    this.isParentTaskSelected = e.target.checked;
    if (e.target.checked) {
      this.taskDetail.startDate = null;
      this.taskDetail.  endDate = null;
      this.taskDetail.priority = 0;
      this.parentTaskName = "";
      this.taskDetail.parentId = undefined;
    }
    else {
      var endDate = new Date();
      endDate.setDate(new Date().getDate() + 1);
      this.taskDetail.startDate = new Date();
      this.taskDetail.endDate = endDate;
    }
  }

  onAddTask() {
    var taskStartDate = new Date(this.taskDetail.startDate);
    var taskEndDate = new Date(this.taskDetail.endDate);

    if (!this.isParentTaskSelected && (taskEndDate <= taskStartDate)) {
      window.alert("End Date should not be prior/equal to start date");
      return false;
    }
    console.log('name:' + this.taskDetail.name);
    console.log('priority:' + this.taskDetail.priority);
    console.log('startdate:' + this.taskDetail.startDate);
    console.log('enddate:' + this.taskDetail.endDate);
    if(this.isParentTaskSelected){
      this.parentTaskDetail.parentTask=this.taskDetail.name;
      this.parentTaskManagerService.AddTask(this.parentTaskDetail).subscribe(response => {
        this.results = "Task added successfully with id:" + response;
        console.log("result text:" + this.results);
      },
        error => {
          console.log(error.status);
          console.log(error.statusText);
          console.log(error._body);
          console.log(JSON.parse(error._body));
          if (error.status < 200 || error.status > 300)
            this.results = JSON.parse(error._body);
        }
      );
    }
    else{
    this.taskManagerService.AddTask(this.taskDetail).subscribe(response => {
      this.results = "Task added successfully with id:" + response;
     this. onView();
      console.log("result text:" + this.results);
    },
      error => {
        console.log(error.status);
        console.log(error.statusText);
        console.log(error._body);
        console.log(JSON.parse(error._body));
        if (error.status < 200 || error.status > 300)
          this.results = JSON.parse(error._body);
      }
    );
  }

  };

  onResetTask() {
    this.taskDetail = new TaskDetail();
    this.taskDetail.priority = 0;
    this.parentTaskName = "";
    this.managerName = "";
    this.projectName = ""
    var endDate = new Date();
    endDate.setDate(new Date().getDate() + 1);
    this.taskDetail.startDate = new Date();
    this.taskDetail.endDate = endDate;
    this.showParentTaskCheckbox.nativeElement.checked = false;
  };

  onValidate() {
    if (this.taskDetail.name == undefined || this.taskDetail.name.trim().length == 0)
      return true;
    
    else if (!this.isParentTaskSelected && (this.taskDetail.startDate.toString().trim().length == 0 ||
      this.taskDetail.endDate.toString().trim().length == 0 ||
      this.taskDetail.priority == 0 || this.taskDetail.parentId == undefined))
      return true;
    else
      return false;
  };

  

  

  onSearchParent() {
    this.onGetAllParentTask();
  }

  onSelectParentTask(selectedTask: ParentTaskDetail) {
    this.taskDetail.parentId = selectedTask.parentId;

    this.parentTaskName = selectedTask.parentTask;
  }

  closeModal() {
    return false;
  }

  onAddTaskNavigateToView() {
    this.router.navigate(['/viewTask']);
  }

  onView() {
    this.router.navigate(['/viewTask']);
  }
  onGetAllParentTask() {
    this.parentTaskManagerService.GetParentList().subscribe(
      response => this.parentTaskDetails = response);
  }

}
