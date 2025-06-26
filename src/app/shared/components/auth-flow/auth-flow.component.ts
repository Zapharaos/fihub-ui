import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AuthFormComponent, AuthFormFieldConfig} from "@shared/components/auth-form/auth-form.component";
import {FormGroup} from "@angular/forms";

export type AuthFlowStep = {
  formConfig: AuthFormFieldConfig;
  onSubmit: (form: FormGroup) => Promise<void>;
}

@Component({
  selector: 'app-auth-flow',
  imports: [
    AuthFormComponent
  ],
  templateUrl: './auth-flow.component.html',
  styleUrl: './auth-flow.component.scss'
})
export class AuthFlowComponent implements OnInit {
  @Input() title?: string | undefined;
  @Input() steps: AuthFlowStep[] = [];
  currentStepIndex: number = 0;
  currentStepFormConfig: AuthFormFieldConfig = {};

  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

  constructor() {}

  ngOnInit(): void {
    // Initialize the current step form configuration
    this.currentStepFormConfig = this.steps[this.currentStepIndex]?.formConfig || {};
  }

  async submit(form: FormGroup) {
    // If the current step index is out of bounds, do nothing
    if (this.currentStepIndex >= this.steps.length) return;

    // Get the current step and set loading state
    const currentStep = this.steps[this.currentStepIndex];
    this.authFormComponent.setLoading(true);

    try {
      // Attempt to submit the form using the current step's onSubmit method
      await currentStep.onSubmit(form)

      // Check if there is a next step
      if (this.currentStepIndex < this.steps.length - 1) {
        // Move to the next step
        this.currentStepIndex++;
        const nextStepFormConfig = this.steps[this.currentStepIndex]?.formConfig;
        this.currentStepFormConfig = nextStepFormConfig;
        this.authFormComponent.setConfig(nextStepFormConfig);
      }
    } catch(error: any) {
      // Handle any errors that occur during form submission
      this.authFormComponent.handleError(error)
    } finally {
      // Reset loading state regardless of success or failure
      this.authFormComponent.setLoading(false);
    }
  }
}
