import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Asnwer, Question } from 'src/app/models/common';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-checkbox-answer',
  templateUrl: './checkbox-answer.component.html',
  styleUrls: ['./checkbox-answer.component.scss']
})
export class CheckboxAnswerComponent implements OnInit {
  @Input() set questionItem(question: Question) {
    this._questionItem = question;
    this.handleQuestion();
  }
  private _questionItem: Question = {}
  get questionItem(): Question {
    return this._questionItem;
  }

  @Output() questionItemChange: EventEmitter<Question> = new EventEmitter<Question>();

  checkboxGroup: FormArray | any;
  hiddenControl = new FormControl('', Validators.required);
  // update checkbox group's value to hidden formcontrol
  answerForm: FormGroup | any;

  constructor(private appService: AppService) { }

  get checkboxGroupList(): Array<AbstractControl> {
    return this.checkboxGroup.controls;
  }

  ngOnInit(): void {
  }

  handleQuestion(): void {
    if (!(this.questionItem && Object.keys(this.questionItem).length > 0)) {
      return;
    }

    const asnwers = this.questionItem.answers || []

    if (Array.isArray(asnwers)) {
      this.checkboxGroup = new FormArray(asnwers.map((answer: Asnwer) => new FormGroup({
        text: new FormControl(answer.answer),
        checkbox: new FormControl(!!answer.isChecked)
      })));
    }

    const notHasOtherAnswer = this.questionItem.isOtherAnswer && asnwers[asnwers.length - 1].answer !== 'Other'
    if (notHasOtherAnswer) {
      this.checkboxGroupList.push(new FormGroup({
        text: new FormControl('Other'),
        checkbox: new FormControl(false)
      }))
    }

    this.answerForm = new FormGroup({
      items: this.checkboxGroup,
      selectedItems: this.hiddenControl,
      otherAnswer: new FormControl(notHasOtherAnswer ? '' : asnwers[asnwers.length - 1].otherAnswer)
    });

    this.answerForm.get('items').valueChanges.subscribe((v: any) => {
      this.hiddenControl.setValue(this.mapItems(v));
    });
  }

  isChooseOtherValue(): boolean {
    const otherControl = this.checkboxGroupList[this.checkboxGroupList.length - 1] as FormGroup
    return otherControl?.controls?.['checkbox']?.value && this.questionItem.isOtherAnswer
  }

  mapItems(_: any) {
    return '';
  }

  onChangeCheckBox(): void {
    const values = this.checkboxGroup.getRawValue();
    if (!Array.isArray(values)) {
      return;
    }

    this.questionItem.answers = values.map((value, index) => {
      if (index === values.length - 1 && this.questionItem.isOtherAnswer) {
        return { answer: value.text, isChecked: value.checkbox, otherAnswer: this.answerForm?.get('otherAnswer')?.value }
      }

      return { answer: value.text, isChecked: value.checkbox }
    })
    this.questionItemChange.emit(this.questionItem);
  }
}
