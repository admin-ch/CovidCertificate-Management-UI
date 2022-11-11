import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthFunction, AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Directive({
	selector: '[ecHasAuthorizationFor],[ecHasAuthorizationForAny],[ecHasAuthorizationForAll]'
})
export class HasAuthorizationForDirective implements OnInit, OnDestroy {
	@Input('ecHasAuthorizationFor')
	functionName: AuthFunction;

	@Input('ecHasAuthorizationForAny')
	anyFunctionNames: AuthFunction[] = [];

	@Input('ecHasAuthorizationForAll')
	allFunctionNames: AuthFunction[] = [];

	isAuthorized: boolean;
	subscription: Subscription;

	constructor(private readonly view: ViewContainerRef, private readonly template: TemplateRef<unknown>, private readonly authService: AuthService) {}

	ngOnInit() {
		if (this.allFunctionNames && this.allFunctionNames.length > 0) {
			this.subscription = this.authService.hasAuthorizationForAll$(...this.allFunctionNames.filter(fn => !!fn)).subscribe(isAuthorized => {
				this.view.clear();
				if (isAuthorized) {
					this.view.createEmbeddedView(this.template);
				}
			});
		} else {
			let functionNames = [this.functionName];
			if (this.anyFunctionNames && this.anyFunctionNames.length > 0) {
				functionNames = this.anyFunctionNames;
			}
			this.subscription = this.authService.hasAuthorizationFor$(...functionNames.filter(fn => !!fn)).subscribe(isAuthorized => {
				this.view.clear();
				if (isAuthorized) {
					this.view.createEmbeddedView(this.template);
				}
			});
		}
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}
}
