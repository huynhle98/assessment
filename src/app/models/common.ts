export interface Type {
  label: string,
  value: number
}

export enum EQuestionType {
  Checkbox = 1,
  Text = 2
}

export const questionTypesData = [
  { label: 'Checkbox list', value: EQuestionType.Checkbox },
  { label: 'Paragraph', value: EQuestionType.Text }
]

export interface Question {
  type?: EQuestionType,
  question?: string,
  answers?: Array<Asnwer>,
  isOtherAnswer?: boolean,
  isRequired?: boolean
}

export interface Asnwer {
  answer: string;
  isChecked?: boolean;
  otherAnswer?: string;
}
