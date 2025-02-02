import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from "@core/services/auth.service";
import {NgIf} from "@angular/common";

@Directive({
  selector: '[appPermission]',
  hostDirectives: [{
    directive: NgIf,
    inputs: ['ngIfElse: appPermissionElse'] },
  ],
  standalone: true,
})
export class PermissionDirective {
  private hasView = false;
  @Input() appPermissionElse: TemplateRef<unknown> | null = null;

  constructor(
    private ngIfDirective: NgIf,
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  @Input() set appPermission(permission: string | string[]) {
    if (this.authService.currentUserHasPermission(permission)) {
      this.ngIfDirective.ngIf = true;
      if (!this.hasView) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else {
      if (this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    }
  }

}
