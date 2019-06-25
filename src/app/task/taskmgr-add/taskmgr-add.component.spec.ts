import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskmgrAddComponent } from './taskmgr-add.component';
import { TaskService } from '../../SharedService/task.service';
import { MockTaskService } from '../../SharedService/mock-task-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskDetail } from '../../models/task-detail';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskmgrSearchPipe } from '../../pipes/taskmgr-search.pipe'

describe('TaskmgrAddComponent', () => {
  let component: TaskmgrAddComponent;
  let fixture: ComponentFixture<TaskmgrAddComponent>;
  
  let taskService: TaskService;
    const taskDetails: any[] = [{
    "id": 1, "name": "Task 1", "startDate": Date.now,
    "endDate": Date.now, "priority": 10,
    "activeStatus": true, "parentId": 2, "parentName": "parent"
  },
  {
    "id": 2, "name": "Task 2", "startDate": Date.now, "endDate": Date.now, "priority": 10,
    "activeStatus": false, "parentId": 2, "parentName": "parent"
  }
  ];

  
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [TaskmgrAddComponent,  TaskmgrSearchPipe],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
               { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmgrAddComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TaskService);
       fixture.detectChanges();
  });

  it('to test should create task', () => {
    expect(component).toBeTruthy();
  });

  it('to test should set default task details', () => {
    component.ngOnInit();
    expect(component.taskDetail.priority).toBe(0);
    expect(component.taskDetail.activeStatus).toBe(true);
  });

  

  it('to test onAddTask should show validation alert', () => {
    component.isParentTaskSelected = false;
    var startDate = new Date();
    startDate.setDate(new Date().getDate() + 1);
    component.taskDetail.startDate = startDate;
    component.taskDetail.endDate = new Date();
    spyOn(window, 'alert').and.stub();

    var result = component.onAddTask();

    expect(result).toBe(false);
    expect(window.alert).toHaveBeenCalledWith("End Date should not be prior/equal to start date");
  });



  it('to test add should return Success', () => {
    component.isParentTaskSelected = true;
    spyOn(taskService, 'AddTask').and.returnValue(Observable.of("1"));
    component.onAddTask();
    expect(component.results.length).toBeGreaterThan(0);
  });

  it('to test add should return Bad Request', () => {
    component.isParentTaskSelected = true;
    var error = { status: 400, _body: '"Bad Request"' };
    spyOn(taskService, 'AddTask').and.returnValue(Observable.throw(error));
    component.onAddTask();
    expect(component.results).toBe("Bad Request");
  });

  it('to test resetting Task Detail', () => {
    var taskDetail = new TaskDetail();
    component.taskDetail = taskDetail;
    taskDetail.id = 6;
    taskDetail.priority = 18;
    taskDetail.name = "test";

    component.onResetTask();

    expect(component.taskDetail.priority).toBe(0);
    expect(component.taskDetail.id).toBeUndefined();
    expect(component.taskDetail.name).toBeUndefined();
    expect(component.parentTaskName).toBe("");
    expect(component.managerName).toBe("");
    expect(component.projectName).toBe("");
  })

  it('should return false when task details are invalid for submit', () => {
    var taskDetail = new TaskDetail();
    component.taskDetail = taskDetail;
    var result = component.onValidate();
    expect(result).toBe(true);

    taskDetail.name = "task 1";
    console.log(component.taskDetail.name);
    var result = component.onValidate();
    expect(result).toBe(true);

    
    var endDate = new Date();
    endDate.setDate(new Date().getDate() + 1);
    taskDetail.startDate = new Date();
    taskDetail.endDate = endDate;
    var result = component.onValidate();

    expect(result).toBe(true);

    taskDetail.priority = 1
    var result = component.onValidate();
    expect(result).toBe(true);

    taskDetail.parentId = 1
    var result = component.onValidate();
    expect(result).toBe(false);
  });

  

  it('to test should return active tasks 1', () => {
    spyOn(taskService, 'GetParentList').and.returnValues(Observable.of(taskDetails));

    component.onGetAllParentTask();

    expect(component.parentTaskDetails.length).toBe(1);
    expect(taskService.GetParentList).toHaveBeenCalled();
  });

  it('to test onAddTaskNavigateToView modal should go to view', () => {
    component.onAddTaskNavigateToView();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/viewTask']);
  });
  

  it('to test onSearchParent should have been called onGetAllParentTask', () => {
    spyOn(component, "onGetAllParentTask").and.stub();
    component.onSearchParent();

    expect(component.onGetAllParentTask).toHaveBeenCalled();
  });

});

