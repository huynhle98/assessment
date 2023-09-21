import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Question } from 'src/app/models/common';

@Component({
  selector: 'app-text-answer',
  templateUrl: './text-answer.component.html',
  styleUrls: ['./text-answer.component.scss']
})
export class TextAnswerComponent {
  @Input() set questionItem(question: Question) {
    this._questionItem = question;
    this.handleQuestion();
  }
  private _questionItem: Question = {}
  get questionItem(): Question {
    return this._questionItem;
  }

  @Output() questionItemChange: EventEmitter<Question> = new EventEmitter<Question>();

  textForm: FormGroup | any;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  initForm(): void {
    this.textForm = this.fb.group({
      answerText: ['']
    });
  }

  get answerTextControl(): AbstractControl {
    return this.textForm.get('answerText')
  }

  handleQuestion(): void {
    if (!this.answerTextControl) {
      return;
    }

    this.answerTextControl.setValue(this.questionItem?.answers?.[0].answer || '')
  }

  onChangeAnswer(): void {
    this.questionItem.answers = [{ answer: this.answerTextControl.value }]
    this.questionItemChange.emit(this.questionItem);
  }
}
