export interface FormField {
  name: string;
  label: string;
  type: string;
  validation: string;
}

export interface FormSchema {
  step1: FormField[];
  step2: FormField[];
}

export interface FormData {
  [key: string]: string;
}

export interface ValidationError {
  error: string;
  details: string[];
}
