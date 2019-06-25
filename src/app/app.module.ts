import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';

import { TaskmgrAddComponent } from './task/taskmgr-add/taskmgr-add.component';
import { TaskmgrViewComponent } from './task/taskmgr-view/taskmgr-view.component';
import { TaskmgrEditComponent } from './task/taskmgr-edit/taskmgr-edit.component';

import { TaskService } from './SharedService/task.service';
import { ParentTaskService } from './SharedService/Parent.service';
import { TaskmgrSearchPipe } from './pipes/taskmgr-search.pipe';
import { TaskmgrSortPipe } from './pipes/taskmgr-sort.pipe';

const appRoutes:Routes=[
  
  {path:'addTask',component:TaskmgrAddComponent},
  {path:'viewTask',component:TaskmgrViewComponent},
  {path:'editTask',component:TaskmgrEditComponent},

]

@NgModule({
  declarations: [
    AppComponent,
       TaskmgrAddComponent,
    TaskmgrViewComponent,
    TaskmgrEditComponent,
    TaskmgrSearchPipe,
       TaskmgrSortPipe
  ],
  
  imports: [
    BrowserModule,FormsModule, HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [TaskService,TaskmgrSearchPipe,ParentTaskService ],
  bootstrap: [AppComponent],
  exports:[TaskmgrSearchPipe ]
})
export class AppModule { }
