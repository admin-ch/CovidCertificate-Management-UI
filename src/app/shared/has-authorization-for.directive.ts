import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthFunction, AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Directive({
	selector: '[ecHasAuthorizationFor],[ecHasAuthorizationForAny]'
})
export class HasAuthorizationForDirective implements OnInit, OnDestroy {
	@Input('ecHasAuthorizationFor')
	functionName: AuthFunction;

	@Input('ecHasAuthorizationForAny')
	functionNames: AuthFunction[] = [];

	isAuthorized: boolean;
	subscription: Subscription;

	constructor(
		private readonly view: ViewContainerRef,
		private readonly template: TemplateRef<any>,
		private authService: AuthService
	) {}

	ngOnInit() {
		const functionNames = this.functionName ? [this.functionName] : this.functionNames ? this.functionNames : [];
		this.subscription = this.authService
			.hasAuthorizationFor$(...functionNames.filter(fn => !!fn))
			.subscribe(isAuthorized => {
				this.view.clear();
				if (isAuthorized) {
					this.view.createEmbeddedView(this.template);
				}
			});
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}
}
