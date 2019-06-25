import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { TaskService } from './task.service';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend, BaseRequestOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection} from  '@angular/http/testing';
import { TaskDetail } from '../models/task-detail';

describe('TaskService', () => {
  let mockBackend: MockBackend;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpModule],
      providers: [TaskService,
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        deps: [MockBackend, BaseRequestOptions],
        useFactory:
          (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
          }
       }
      ]
    });

    mockBackend = getTestBed().get(MockBackend);
  });

  it('should be created', inject([TaskService], (service: TaskService) => {
    expect(service).toBeTruthy();
  }));

  it('should get task', done => {
    let taskService: TaskService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: [
                  {id: 1, name: 'TaskDetail 1', priority:10},
                  {id: 2, name: 'TaskDetail 2',  priority:20},
                ]
              }
            )));
        });

        taskService = getTestBed().get(TaskService);
        expect(taskService).toBeDefined();

        taskService.GetAllTasks().subscribe((tasks: TaskDetail[]) => {
            expect(tasks.length).toBeDefined();
            expect(tasks.length).toEqual(2);
            expect(tasks[0].id).toEqual(1);
            expect(tasks[0].name).toEqual('TaskDetail 1');
            expect(tasks[1].name).toEqual('TaskDetail 2');
            done();
        });

        taskService.GetParentList().subscribe((tasks: TaskDetail[]) => {
          expect(tasks.length).toBeDefined();
          expect(tasks.length).toEqual(2);
          expect(tasks[0].id).toEqual(1);
          expect(tasks[0].name).toEqual('TaskDetail 1');
          expect(tasks[1].name).toEqual('TaskDetail 2');
          done();
      });
    });
  });

  it('should get task for the given id', done => {
    let taskService: TaskService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                      body:                
                        {id: 2, name: 'TaskDetail 2', priority:20}                
                  }
            )));
        });

        taskService = getTestBed().get(TaskService);
        expect(taskService).toBeDefined();
        taskService.GetTask(2).subscribe((taskDetail: TaskDetail) => {          
            expect(taskDetail.id).toEqual(2);
            expect(taskDetail.name).toEqual('TaskDetail 2');           
            done();
        });
    });
  });


  it('should insert new task',
    async(inject([TaskService], (taskService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Post);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200, 
          body:{id: 2, name: 'TaskDetail 2', priority:20}})));
      });

      let taskDetail = new TaskDetail ();
      taskDetail.priority = 20;
      taskDetail.name="taskDetail 2";
      taskService.AddTask(taskDetail).subscribe(
        (projectResponse: TaskDetail) => {
          expect(projectResponse).toBeDefined();
          console.log(projectResponse);           
        expect(projectResponse.id).toBe(2);
        expect(projectResponse.name).toBe('TaskDetail 2');
        });
    })));

    it('should update existing taskDetail',
    async(inject([TaskService], (taskService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {       
        expect(connection.request.method).toBe(RequestMethod.Put);       
        connection.mockRespond(new Response(new ResponseOptions({status: 200, 
          body:{id: 2, name: 'TaskDetail 2 updated', priority:20}})));
      });

      let taskDetail = new TaskDetail ();
      taskDetail.id = 2;
      taskDetail.priority = 10;
      taskDetail.name="TaskDetail 2 updated";
      taskService.PutTask(2, taskDetail).subscribe(
        (projectResponse: TaskDetail) => {
          expect(projectResponse).toBeDefined();
          console.log(projectResponse);
        expect(projectResponse.name).toBe("TaskDetail 2 updated");
        });
    })));
});
