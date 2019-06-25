import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ParentTaskDetail } from '../../models/ParentTask-detail';
import { TaskDetail } from '../../models/task-detail';
import { ParentTaskService } from '../../SharedService/Parent.service';
import { TaskService } from '../../SharedService/task.service';

import 'rxjs/add/operator/catch';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-taskmgr-edit',
  templateUrl: './taskmgr-edit.component.html',
  styleUrls: ['./taskmgr-edit.component.css']
})
export class TaskmgrEditComponent implements OnInit {


  @ViewChild('showmodalClick') showmodalClick: ElementRef;
  @ViewChild('showParentTaskCheckbox') showParentTaskCheckbox: ElementRef;
  taskDetails: TaskDetail[]
  taskDetail: TaskDetail;
  parentTaskDetail: ParentTaskDetail;
  updateTaskId: number
  results: string
  parentTaskName: string;
  showError: boolean = false;
  managerName: string;
  projectName: string;
  isParentTaskSelected: boolean = false;
  parentTaskSearch: string;
  userSearch: string;
  public parentTaskDetails: TaskDetail[];
 
  constructor(private taskManagerService: TaskService, private parentTaskManagerService:ParentTaskService,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.updateTaskId = params['id'];
    })

    this.taskManagerService.GetTask(this.updateTaskId).subscribe(
      response => {
        this.taskDetail = response;
        this.parentTaskManagerService.GetTask(this.taskDetail.parentId).subscribe(
          parentTaskResponse => {
            this.parentTaskDetail = parentTaskResponse;
            this.parentTaskName = this.parentTaskDetail.parentTask;
          });

        this.taskDetail.parentId = this.taskDetail.parentId;
       
        if (this.taskDetail.startDate == undefined) {
          this.showParentTaskCheckbox.nativeElement.checked = true;
          this.isParentTaskSelected = true;
        }
      },
      error => {
        if (error.status < 200 || error.status > 300) {
          this.showError = true;
          this.results = JSON.parse(error._body);
        }
        console.log("error " + error.statusText);
      });


  }

  onValidate() {
    if (this.taskDetail.name == undefined || this.taskDetail.name.trim().length == 0)
      return true;
    
    else if (!this.isParentTaskSelected && (this.taskDetail.startDate.toString().trim().length == 0 ||
      this.taskDetail.endDate.toString().trim().length == 0 ||
      this.taskDetail.priority == 0 || this.taskDetail.parentId == undefined))
      return true;
    else
      return false;
  }

  onUpdateTask() {
    var taskStartDate = new Date(this.taskDetail.startDate);
    var taskEndDate = new Date(this.taskDetail.endDate);

    if (!this.isParentTaskSelected && (taskEndDate <= taskStartDate)) {
      window.alert("End Date should not be prior/equal to start date");
      return false;
    }

    this.taskManagerService.PutTask(this.taskDetail, this.taskDetail.id).subscribe(response => {
      this.results = this.results = "Task has been updated successfully for the name " + response;;
      console.log("result text:" + this.results);
    },
      error => {
        if (error.status < 200 || error.status > 300)
          this.results = JSON.parse(error._body);
        console.log("error " + error._body);
      }
    );
  }

  onCancel() {
    this.router.navigate(['/viewTask']);
  }

  

  onSearchParent() {
    this.onGetAllParentTask();
  }

  onGetAllParentTask() {
    this.taskManagerService.GetParentList().subscribe(
      response => this.parentTaskDetails = response.filter(resElement => resElement.id != this.updateTaskId && resElement.activeStatus));
  }

  onSelectParentTask(selectedTask: TaskDetail) {
    this.taskDetail.parentId = selectedTask.id;
    this.parentTaskName = selectedTask.name;
  }
  
  closeModal() {
    this.router.navigate(['/viewTask']);
  }

  closeModalPopup() {
    return false;
  }

}
