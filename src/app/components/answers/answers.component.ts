import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { BaseAbstractComponent } from '../base/base.component';
import { takeUntil } from 'rxjs';
import { EQuestionType, Question } from 'src/app/models/common';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent extends BaseAbstractComponent implements OnInit {
  questionList: Array<Question> = [];
  questionTypeValue = EQuestionType;

  constructor(private appService: AppService) {
    super();
  }

  ngOnInit(): void {
    this.handleQuestionList();
  }

  handleQuestionList(): void {
    this.appService.questionList$.pipe(takeUntil(this.destroy$)).subscribe((questions => {
      if (!Array.isArray(questions)) {
        this.questionList = []
        return;
      }

      this.questionList = questions;
    }))
  }
}
