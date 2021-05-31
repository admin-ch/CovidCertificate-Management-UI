import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CreateComponent} from './create.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {of} from 'rxjs';
import {ValueSetsService} from '../utils/value-sets.service';
import {CertificateService} from 'shared/certificate.service';

describe('CreateComponent', () => {
	let component: CreateComponent;
	let fixture: ComponentFixture<CreateComponent>;

	const mockValueSetsService = {
		setValueSets: jest.fn()
	};

	const mockCertificateService = {
		getValueSets: jest.fn().mockReturnValue(of({}))
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			declarations: [CreateComponent],
			providers: [
				{
					provide: ValueSetsService,
					useValue: mockValueSetsService
				},
				{
					provide: CertificateService,
					useValue: mockCertificateService
				}
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have a stepper', () => {
		expect(component.stepper).toBeDefined();
	});

	it('should fetch the value sets on init', () => {
		expect(mockCertificateService.getValueSets).toHaveBeenCalledTimes(1);
	});

	it('should set the selectForm to undefined on init', () => {
		expect(component.selectedForm).toBeUndefined();
	});

	it('should set the value sets on init in the ValueSetsService', () => {
		expect(mockValueSetsService.setValueSets).toHaveBeenCalledTimes(1);
	});
});
