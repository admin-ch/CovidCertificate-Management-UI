import {Directive, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
	selector: '[ecDeliveryCodeCleaner]'
})
export class DeliveryCodeCleanerDirective {
	constructor(private readonly ngControl: NgControl) {}

	@HostListener('blur')
	onBlur(): void {
		this.setValue(this.ngControl.value);
	}

	private setValue(value: string): void {
		if (value) {
			this.ngControl.reset(this.formatValue(value));
		}
	}

	private formatValue(value: string): string {
		return value.replace(/\s/gi, '').toUpperCase();
	}
}
