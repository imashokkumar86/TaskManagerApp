import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent
      ],

      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  })); 
  
});
