import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskmgrEditComponent } from './taskmgr-edit.component';
import { TaskService } from '../../SharedService/task.service';
import { MockTaskService } from '../../SharedService/mock-task-service';
import { Observable } from '../../../../node_modules/rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/throw';
import { FormsModule }   from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskDetail } from '../../models/task-detail';
import { Router,ActivatedRoute} from '@angular/router';
import { TaskmgrSearchPipe } from '../../pipes/taskmgr-search.pipe'

describe('TaskmgrEditComponent', () => {
  let component: TaskmgrEditComponent;
  let fixture: ComponentFixture<TaskmgrEditComponent>;
   let taskService : TaskService; 
    const TASK_DETAILS : any[] = [{ "id": 1, "name": "Task 1", "startDate": Date.now, 
  "endDate" :Date.now, "priority":10, 
      "activeStatus":true, "parentId":2, "parentName":"parent" },
      { "id": 2, "name": "Task 2", "startDate": Date.now, "endDate" :Date.now, "priority":10, 
      "activeStatus":false, "parentId":2, "parentName":"parent" }
    ];    

      let mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule],
      declarations: [ TaskmgrEditComponent,TaskmgrSearchPipe ] , 
      providers: [
        {provide: TaskService, useClass: MockTaskService},
               { provide: ActivatedRoute, useValue: { 'queryParams': Observable.from([{ 'id': 101 }]) } },
        { provide: Router, useValue: mockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmgrEditComponent);
    component = fixture.componentInstance;
    taskService = TestBed.get(TaskService);
        fixture.detectChanges();   
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });  

  it('should return false when task details are invalid for submit', () =>
  {
    var taskDetail = new TaskDetail();
    component.taskDetail = taskDetail;
    var result = component.onValidate();
    expect(result).toBe(true);

    taskDetail.name = "task 1";    
    var result = component.onValidate();
    expect(result).toBe(true);
     
    var endDate = new Date();
    endDate.setDate(new Date().getDate() + 1);  
    taskDetail.startDate =  new Date();
    taskDetail.endDate = endDate;
    component.isParentTaskSelected = false;
    taskDetail.priority = 0;
    var result = component.onValidate();
 
    expect(result).toBe(true);

    taskDetail.priority = 1
    var result = component.onValidate();
    expect(result).toBe(true);

    taskDetail.parentId = 1
    var result = component.onValidate();
    expect(result).toBe(false);
  });

  it('onUpdateTask should show validation alert', () =>
  {
    component.isParentTaskSelected = false;      
    var startDate = new Date();
    startDate.setDate(new Date().getDate() + 1);  
    component.taskDetail.startDate =  startDate;
    component.taskDetail.endDate = new Date();    
    spyOn(window,'alert').and.stub();

    var result = component.onUpdateTask();

    expect(result).toBe(false);
    expect(window.alert).toHaveBeenCalledWith("End Date should not be prior/equal to start date");
  });

  it('Update should return Success', () =>
  {
    component.isParentTaskSelected = true;   
    spyOn(taskService,'PutTask').and.returnValue(Observable.of("1")); 
    component.onUpdateTask();   
    expect(component.results.length).toBeGreaterThan(0);         
  });

  it('Update should return Bad Request', () =>
  {
    component.isParentTaskSelected = true;  
    var error = { status: 400, _body :'"Bad Request"'};   
    spyOn(taskService,'PutTask').and.returnValue(Observable.throw(error));
    component.onUpdateTask();  
    expect(component.results).toBe("Bad Request");             
  });

  it('onCancel should go to view', () =>
  {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/viewTask']);
  })

  

  

  it('onSearchParent should have been called onGetAllParentTask', () =>
  {
    spyOn(component,"onGetAllParentTask").and.stub();
    component.onSearchParent();

    expect(component.onGetAllParentTask).toHaveBeenCalled();
  });

  it('Should return active tasks 1', () =>
  {
    spyOn(taskService,'GetParentList').and.returnValues(Observable.of(TASK_DETAILS));
    
    component.onGetAllParentTask();    

    expect(component.parentTaskDetails.length).toBe(1);   
    expect(taskService.GetParentList).toHaveBeenCalled();
  });

  it('onSelectParentTask should set parentTaskName', () =>
  {
    var parentTaskDetail= new TaskDetail();
    parentTaskDetail.id = 1001;
    parentTaskDetail.name = "parent task";
    component.taskDetail = new TaskDetail();

    component.onSelectParentTask(parentTaskDetail);

    expect(component.taskDetail.parentId).toBe(1001);
    expect(component.parentTaskName).toBe("parent task");
  });

  it('closeModal should go to view', () =>
  {
    component.closeModal();     

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/viewTask']);
  })

  
});
