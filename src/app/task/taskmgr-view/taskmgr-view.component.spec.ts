import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskmgrViewComponent } from './taskmgr-view.component';
import { TaskService } from '../../SharedService/task.service';
import { MockTaskService } from '../../SharedService/mock-task-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/throw';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskDetail } from '../../models/task-detail';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskmgrSortPipe } from '../../pipes/taskmgr-sort.pipe'
import { DatePipe } from '@angular/common';

describe('TaskmgrViewComponent', () => {
  let component: TaskmgrViewComponent;
  let fixture: ComponentFixture<TaskmgrViewComponent>;

  let taskService: TaskService;
    let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  
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

  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [TaskmgrViewComponent, TaskmgrSortPipe],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
                { provide: ActivatedRoute, useValue: { 'queryParams': Observable.from([{ 'id': 101 }]) } },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmgrViewComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TaskService);
       fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  

  

  it('Edit method should go to Edit Route', () => {
    component.edit(101);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/editTask'], Object({ queryParams: Object({ id: 101 }) }));
  })

  it('Sort Task', () => {
    component.sortTask('startDate');
    expect("startDate").toBe(component.path[0]);
    expect(-1).toBe(component.order);
  });

  it('EndTask should handle Internal server error and Active Status should be true', () => {
    component.taskDetailsFiltered = taskDetails;

    var error = { status: 500, statusText: "500", _body: '"Internal server error"' };
    spyOn(taskService, 'PutTask').and.returnValue(Observable.throw(error));
    component.endTask(1);
    expect("500-Internal server error").toBe(component.results);
    expect(taskService.PutTask).toHaveBeenCalledWith(taskDetails[0], 1);
    expect(component.taskDetail.activeStatus).toBe(true);
  });

});
