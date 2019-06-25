import { Pipe, PipeTransform } from '@angular/core';
import { TaskDetail } from '../models/task-detail';

@Pipe({
  name: 'taskmgrSort'
})
export class TaskmgrSortPipe implements PipeTransform {

  transform(taskDetail: TaskDetail[], path: string[], order: number = 1): any {
    if (!taskDetail || !path || !order) return taskDetail;

    return taskDetail.sort((a: TaskDetail, b: TaskDetail) => {     
      path.forEach(property => {
        a = a[property];
        b = b[property];
      })     
      return a > b ? order : order * (- 1);
    })
  }
}
