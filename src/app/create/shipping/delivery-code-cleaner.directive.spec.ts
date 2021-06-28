import {DeliveryCodeCleanerDirective} from './delivery-code-cleaner.directive';
import {ChangeDetectionStrategy, Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

@Component({
	template: '<input name="appCode" [(ngModel)]="appCode" ecDeliveryCodeCleaner/>',
	changeDetection: ChangeDetectionStrategy.OnPush
})
class TestComponent {
	appCode: string;
}

describe('DeliveryCodeCleanerDirective', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [TestComponent, DeliveryCodeCleanerDirective]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		element = fixture.debugElement.query(By.directive(DeliveryCodeCleanerDirective));
	});

	it('should remove spaces', () => {
		element.triggerEventHandler('focus', null);
		element.nativeElement.value = 'A B    C    ';

		element.triggerEventHandler('input', {target: element.nativeElement});

		element.triggerEventHandler('blur', null);

		fixture.detectChanges();

		expect(component.appCode).toBe('ABC');
	});

	it('should transform to upper case', () => {
		element.triggerEventHandler('focus', null);
		element.nativeElement.value = 'abc';

		element.triggerEventHandler('input', {target: element.nativeElement});

		element.triggerEventHandler('blur', null);

		fixture.detectChanges();

		expect(component.appCode).toBe('ABC');
	});

	it('should transform to upper case and remove spaces', () => {
		element.triggerEventHandler('focus', null);
		element.nativeElement.value = 'a b   c       ';

		element.triggerEventHandler('input', {target: element.nativeElement});

		element.triggerEventHandler('blur', null);

		fixture.detectChanges();

		expect(component.appCode).toBe('ABC');
	});
});
