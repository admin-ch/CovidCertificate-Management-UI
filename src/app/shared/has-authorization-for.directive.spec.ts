import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {HasAuthorizationForDirective} from './has-authorization-for.directive';
import {AuthFunction, AuthService} from '../auth/auth.service';
import {of} from 'rxjs';

@Component({
	template: `
		<div id="ecHasAuthorizationForDiv" *ecHasAuthorizationFor="AuthFunction.CREATE_CERTIFICATE_WEB"></div>
		<div
			id="ecHasAuthorizationForAnyDiv"
			*ecHasAuthorizationForAny="[
				AuthFunction.CREATE_CERTIFICATE_WEB,
				AuthFunction.CREATE_TEST_CERTIFICATE,
				AuthFunction.OTP_GENERATION
			]"
		></div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
class TestComponent {
	AuthFunction: typeof AuthFunction = AuthFunction;
}

describe('HasAuthorizationForDirective', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	const hasAuthorizationFor$Mock = jest.fn();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule],
			providers: [
				{
					provide: AuthService,
					useValue: {
						hasAuthorizationFor$: hasAuthorizationFor$Mock
					}
				}
			],
			declarations: [TestComponent, HasAuthorizationForDirective]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		hasAuthorizationFor$Mock.mockReturnValue(of());
	});

	describe('ecHasAuthorizationFor', () => {
		it('should call hasAuthorizationFor$ with correct params', () => {
			fixture.detectChanges();
			expect(hasAuthorizationFor$Mock).toHaveBeenCalledWith(AuthFunction.CREATE_CERTIFICATE_WEB);
		});
		it('should render element if hasAuthorizationFor$ emits true', () => {
			hasAuthorizationFor$Mock.mockReturnValue(of(true));

			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('#ecHasAuthorizationForDiv'))).toBeTruthy();
		});
		it('should not render element if hasAuthorizationFor$ emits false', () => {
			hasAuthorizationFor$Mock.mockReturnValue(of(false));

			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('#ecHasAuthorizationForDiv'))).toBeFalsy();
		});
	});
	describe('ecHasAuthorizationForAny', () => {
		it('should call hasAuthorizationFor$ with correct params', () => {
			fixture.detectChanges();
			expect(hasAuthorizationFor$Mock).toHaveBeenCalledWith(
				AuthFunction.CREATE_CERTIFICATE_WEB,
				AuthFunction.CREATE_TEST_CERTIFICATE,
				AuthFunction.OTP_GENERATION
			);
		});
		it('should render element if hasAuthorizationFor$ emits true', () => {
			hasAuthorizationFor$Mock.mockReturnValue(of(true));

			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('#ecHasAuthorizationForAnyDiv'))).toBeTruthy();
		});
		it('should not render element if hasAuthorizationFor$ emits false', () => {
			hasAuthorizationFor$Mock.mockReturnValue(of(false));

			fixture.detectChanges();

			expect(fixture.debugElement.query(By.css('#ecHasAuthorizationForAnyDiv'))).toBeFalsy();
		});
	});
});
