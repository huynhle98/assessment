import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { EQuestionType, Question, Type, questionTypesData } from 'src/app/models/common';
import { AppService } from 'src/app/services/app.service';
import { BaseAbstractComponent } from '../base/base.component';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent extends BaseAbstractComponent implements OnInit {
  display = false;
  displayOptions = true;
  isSubmited = false;

  questionTypes: Array<Type> = questionTypesData;
  questionTypeValue = EQuestionType;
  selectedType: EQuestionType = EQuestionType.Checkbox;

  questionForm: FormGroup | any;

  answerForm: Array<any> = [];

  questionList: Array<Question> = [];

  get answers() {
    return this.questionForm.get('answers') as FormArray;
  }

  constructor(private fb: FormBuilder, private appService: AppService) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
    this.handleQuestionList();
  }

  initForm(): void {
    this.questionForm = this.fb.group({
      type: [EQuestionType.Checkbox, Validators.required],
      question: ['', Validators.required],
      answers: new FormArray([]) || [],
      isOtherAnswer: [false],
      isRequired: [false]
    });
    this.addAnswerGr();
    this.addAnswerGr();
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

  showBuilderForm() {
    this.display = true;
    this.isSubmited = false;
    this.selectedType = EQuestionType.Checkbox;
    this.displayOptions = true;
    this.questionForm.reset();
    this.initForm();
  }

  onSubmitNewQuestion() {
    this.isSubmited = true;
    if (this.questionForm.valid) {
      const data = this.questionForm.getRawValue() as Question;
      this.questionList.push(data);
      this.appService.questionList$.next(this.questionList);
      this.display = false;
    }
  }

  addAnswerGr() {
    const answerGr = this.fb.group({
      answer: ['', Validators.required]
    })
    this.answers.push(answerGr);
  }

  onAddNewAnswer() {
    if (this.answers.controls.length < 5) {
      this.addAnswerGr();
    }
  }

  onRemoveLastAnswer() {
    this.answers.removeAt(this.answers.length - 1);
  }

  onTypeChange() {
    this.displayOptions = this.selectedType === EQuestionType.Checkbox;
    for (const ansControl of this.questionForm.controls.answers.controls) {
      if (this.displayOptions) {
        (ansControl as FormGroup)['controls']['answer'].addValidators(Validators.required);
      } else {
        (ansControl as FormGroup)['controls']['answer'].removeValidators(Validators.required);
        (ansControl as FormGroup)['controls']['answer'].setErrors(null);
      }
    }
  }

  checkErrMsg(formControl: any, i?: number) {
    if (typeof i === 'number') {
      const control = formControl.controls[i];
      if (control) {
        return control['controls']['answer']['errors']?.['required'] && this.isSubmited;
      }
    } else if (formControl) {
      return formControl['errors']?.['required'] && this.isSubmited;
    }
    return;
  }

  questionItemChange(question: Question, index: number): void {
    this.questionList[index] = question;
    this.appService.questionList$.next(this.questionList)
  }
}
