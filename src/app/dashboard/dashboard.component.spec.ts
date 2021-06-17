import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {DashboardComponent} from './dashboard.component';
import {ObliqueTestingModule} from '@oblique/oblique';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

describe('DashboardComponent', () => {
	let component: DashboardComponent;
	let fixture: ComponentFixture<DashboardComponent>;
	const router = {
		navigateByUrl: jasmine.createSpy('navigateByUrl')
	};

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [
					RouterTestingModule.withRoutes([
						{
							path: 'test',
							component: DashboardComponent
						}
					]),
					ObliqueTestingModule
				],
				declarations: [DashboardComponent],
				schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
				providers: [{provide: Router, useValue: router}]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('go to certificate create', () => {
		component.goToCertificateCreate();

		expect(router.navigateByUrl).toHaveBeenCalledWith('certificate-create');
	});

	it('go to certificate revoke', () => {
		component.goToCertificateRevoke();

		expect(router.navigateByUrl).toHaveBeenCalledWith('certificate-revoke');
	});

	it('go to generate otp', () => {
		component.goToGenerateOtp();

		expect(router.navigateByUrl).toHaveBeenCalledWith('otp');
	});

	it('go to generate multiple certificates', () => {
		component.goToGenerateMultipleCertificates();

		expect(router.navigateByUrl).toHaveBeenCalledWith('upload');
	});
});
