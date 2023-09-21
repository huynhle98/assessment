import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Question } from '../models/common';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  questionList$: BehaviorSubject<Array<Question>> = new BehaviorSubject<Array<Question>>([]);

  constructor() { }
}
