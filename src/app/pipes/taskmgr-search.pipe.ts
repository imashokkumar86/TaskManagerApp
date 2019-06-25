import { Pipe, PipeTransform } from '@angular/core';
import { TaskDetail } from '../models/task-detail';

@Pipe({
  name: 'taskmgrSearch'
})
export class TaskmgrSearchPipe implements PipeTransform {

  transform(items: TaskDetail[], parentTaskSearch: any): any {
    if (items && items.length){
      return items.filter(item =>{ 
        if (parentTaskSearch)
        {
          if(item.name.toLowerCase().indexOf(parentTaskSearch.toLowerCase()) === 0 ||            
          item.priority.toString().indexOf(parentTaskSearch) === 0 
        )        
          return true;
          else
          return false;
        }        
       return true;
    })
  }
    else{
        return items;
    }
  }

}
