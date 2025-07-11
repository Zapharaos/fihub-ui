import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AuthFormComponent, AuthFormFieldConfig} from "@shared/components/auth-form/auth-form.component";
import {FormGroup} from "@angular/forms";
import {AuthOtpStore, AuthRequestKey} from "@shared/stores/auth-otp.service";
import {Router} from "@angular/router";
import {NotificationService} from "@shared/services/notification.service";
import {ResponseError} from "@shared/utils/errors";

export interface AuthFlowStep {
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
export class AuthFlowComponent implements OnInit, AfterViewInit {
  @Input() setup?: () => Promise<void>;
  @Input() title?: string | undefined;
  @Input() steps: AuthFlowStep[] = [];
  @Input() authRequestKey!: AuthRequestKey;
  currentStepFormConfig: AuthFormFieldConfig = {};
  readyForNextStep = true;

  @ViewChild(AuthFormComponent) authFormComponent!: AuthFormComponent;

  constructor(
    private authOtpStore: AuthOtpStore,
    private router: Router,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {

    // Not allowed to proceed to the next step until the setup is complete
    if (this.setup) {
      this.readyForNextStep = false;
    }

    // Subscribe to the request observable -> watch for changes in the request state
    this.authOtpStore.getAsObservable(this.authRequestKey)?.subscribe((request) => {
      // If there is a valid request, apply new step configuration
      if (request && this.readyForNextStep) {
        if (!request.currentStepIndex) {
          // If the current step index is not set, default to the first step
          request.currentStepIndex = 0;
        }
        this.readyForNextStep = false;
        this.applyStep(request.currentStepIndex);
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    // Initialize the authOtpStore to set up the initial state
    this.authOtpStore.init(this.authRequestKey);

    // If the request was not initialized, force it to the first step
    if (!this.authOtpStore.get(this.authRequestKey)) {
      this.authOtpStore.set(this.authRequestKey, {
        currentStepIndex: 0,
      });
    }

    if (this.setup) {
      try {
        // Set to true before calling the setup function so that the observable subscription can react
        this.readyForNextStep = true;
        await this.setup();
      } catch(error: unknown) {
        // Reset the state to prevent further steps from being applied
        this.readyForNextStep = false;
        // Handle any errors that occur during form submission
        this.authFormComponent.handleError(error as ResponseError);
      }
    }
  }

  async submit(form: FormGroup) {
    // Retrieve the current step index from the authOtpStore
    const index = this.authOtpStore.get(this.authRequestKey)?.currentStepIndex;

    // Step conditions aren't met, handle the error
    if (index === undefined || index === null || index >= this.steps.length) {
      this.router.navigate(['/auth']).then(() => {
        this.notificationService.showToastError('error.default')
      })
      return;
    }

    // Check if the request is expired
    if (AuthOtpStore.isRequestExpired(this.authOtpStore.get(this.authRequestKey))) {
      this.authOtpStore.reset(this.authRequestKey)
      this.notificationService.showToastError('auth.otp-flow.messages.request-expired');
      return;
    }

    // Set the form into loading state
    this.authFormComponent.setLoading(true);

    try {
      // Attempt to submit the form using the current step's onSubmit method
      await this.steps[index].onSubmit(form)

      // Check if there is a next step and move to it
      if (index + 1 < this.steps.length) {
        this.readyForNextStep = true; // Allow the next step to be applied
        this.authOtpStore.set(this.authRequestKey, {
          ...this.authOtpStore.get(this.authRequestKey)!,
          currentStepIndex: index + 1,
        });
      }
      else {
        // Finalize the request by resetting the authOtpStore
        this.authOtpStore.reset(this.authRequestKey);
      }
    } catch(error: unknown) {
      // Handle any errors that occur during form submission
      this.authFormComponent.handleError(error as ResponseError);
    } finally {
      // Reset loading state regardless of success or failure
      this.authFormComponent.setLoading(false);
    }
  }

  private applyStep(index: number) {
    const nextStepFormConfig = this.steps[index]?.formConfig;
    setTimeout(() => {
      this.authFormComponent.setConfig(nextStepFormConfig);
      this.currentStepFormConfig = nextStepFormConfig;
    });
  }
}
