import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SelectCertificateTypeComponent} from './select-certificate-type.component';
import {ObliqueTestingModule} from '@oblique/oblique';
import {ReactiveFormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';
import {CreationDataService} from '../utils/creation-data.service';
import {GenerationType} from 'shared/model';
import {AuthFunction, AuthService} from "../../auth/auth.service";

describe.skip('SelectCertificateTypeComponent', () => {
	let component: SelectCertificateTypeComponent;
	let fixture: ComponentFixture<SelectCertificateTypeComponent>;
	let creationDataService: CreationDataService;
	const authServiceMock = {
		authorizedFunctions$: {
			pipe: () => ({
				subscribe: (fn) => fn([
					AuthFunction.CREATE_CERTIFICATE_WEB,
					AuthFunction.CREATE_VACCINATION_CERTIFICATE,
					AuthFunction.CREATE_VACCINATION_TOURIST,
					AuthFunction.CREATE_TEST_CERTIFICATE,
					AuthFunction.CREATE_RECOVERY_CERTIFICATE,
					AuthFunction.CREATE_RECOVERY_RAT_CERTIFICATE,
					AuthFunction.CREATE_ANTIBODY_CERTIFICATE,
					AuthFunction.CREATE_EXCEPTIONAL_CERTIFICATE,
				])
			})
		}
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, ReactiveFormsModule, MatRadioModule],
			providers: [
				{
					provide: AuthService,
					useValue: authServiceMock
				}
			],
			declarations: [SelectCertificateTypeComponent],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectCertificateTypeComponent);
		creationDataService = TestBed.inject(CreationDataService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have the default certificate type to vaccination if authorized for all', () => {
		expect(component.certificateTypeSelectionForm.get('type').value).toBe('vaccination');
	});

	describe('Form validation', () => {
		it('should marks the form as invalid if the type is not selected', () => {
			component.certificateTypeSelectionForm.get('type').setValue('');
			expect(component.certificateTypeSelectionForm.invalid).toBeTruthy();
		});

		it('should marks the form as valid if the type is set to vaccination', () => {
			component.certificateTypeSelectionForm.get('type').setValue('vaccination');
			expect(component.certificateTypeSelectionForm.invalid).toBeFalsy();
		});
	});

	describe('Certificate type options', () => {
		it('should have the correct number of options', () => {
			expect(component.typeSelection.length).toBe(7);
		});

		it('should have vaccination as option', () => {
			expect(component.typeSelection[0]).toBe('vaccination');
		});

		it('should have test as option', () => {
			expect(component.typeSelection[1]).toBe('test');
		});

		it('should have recovery as option', () => {
			expect(component.typeSelection[2]).toBe('recovery');
		});
	});

	describe('Handling of goNext()', () => {
		it('should not emit next if the type is not selected', () => {
			const nextSpy = jest.spyOn(component.next, 'emit');

			component.certificateTypeSelectionForm.get('type').setValue('');
			component.goNext();

			expect(nextSpy).toHaveBeenCalledTimes(0);
		});

		it('should emit next if the type is selected', () => {
			const nextSpy = jest.spyOn(component.next, 'emit');

			component.certificateTypeSelectionForm.get('type').setValue('recovery');
			component.goNext();

			expect(nextSpy).toHaveBeenCalledTimes(1);
		});

		it('should call the CreationDataService for setting the type', () => {
			const setNewCertificateTypeSpy = jest.spyOn(creationDataService, 'setNewCertificateType');
			component.certificateTypeSelectionForm.get('type').setValue('recovery');
			component.goNext();

			expect(setNewCertificateTypeSpy).toHaveBeenCalledTimes(1);
		});

		it('should give the type to the CreationDataService', () => {
			const setNewCertificateTypeSpy = jest.spyOn(creationDataService, 'setNewCertificateType');
			component.certificateTypeSelectionForm.get('type').setValue('recovery');
			component.goNext();

			expect(setNewCertificateTypeSpy).toHaveBeenLastCalledWith('recovery');
		});
	});

	describe('Form reset', () => {
		it('should reset the form correctly if the selected type was vaccination', () => {
			component.certificateTypeSelectionForm.get('type').setValue(GenerationType.VACCINATION);
			creationDataService.emitResetCalled();
			expect(component.certificateTypeSelectionForm.value.type).toBe(GenerationType.VACCINATION);
		});

		it('should reset the form correctly if the selected type was test', () => {
			component.certificateTypeSelectionForm.get('type').setValue(GenerationType.TEST);
			creationDataService.emitResetCalled();
			expect(component.certificateTypeSelectionForm.value.type).toBe(GenerationType.TEST);
		});

		it('should reset the form correctly if the selected type was recovery', () => {
			component.certificateTypeSelectionForm.get('type').setValue(GenerationType.RECOVERY);
			creationDataService.emitResetCalled();
			expect(component.certificateTypeSelectionForm.value.type).toBe(GenerationType.RECOVERY);
		});
	});
});
