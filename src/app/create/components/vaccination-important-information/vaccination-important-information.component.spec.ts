import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ObliqueTestingModule} from '@oblique/oblique';
import {VaccinationImportantInformationComponent} from './vaccination-important-information.component';
import {MatCheckboxModule} from '@angular/material/checkbox';

describe('WhoCheckboxComponent', () => {
	let component: VaccinationImportantInformationComponent;
	let fixture: ComponentFixture<VaccinationImportantInformationComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, ReactiveFormsModule, MatCheckboxModule],
			declarations: [VaccinationImportantInformationComponent],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VaccinationImportantInformationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
