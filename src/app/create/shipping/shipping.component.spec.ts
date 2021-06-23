import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ShippingComponent} from './shipping.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ObliqueTestingModule} from '@oblique/oblique';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('ShippingComponent', () => {
	let component: ShippingComponent;
	let fixture: ComponentFixture<ShippingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				NoopAnimationsModule,
				ObliqueTestingModule,
				ReactiveFormsModule,
				MatSelectModule,
				MatFormFieldModule,
				MatInputModule
			],
			declarations: [ShippingComponent],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ShippingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Handling of goBack()', () => {
		it('should emit back', () => {
			const backSpy = jest.spyOn(component.back, 'emit');

			component.goBack();

			expect(backSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Handling of goNext()', () => {
		it('should not emit next if the form is invalid', () => {
			const nextSpy = jest.spyOn(component.next, 'emit');

			component.goNext();

			expect(nextSpy).toHaveBeenCalledTimes(0);
		});
	});

	describe('Canton codes', () => {
		it('should have 26 cantons code', () => {
			expect(component.cantonCodes.length).toBe(26);
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[0]).toBe('AG');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[1]).toBe('AI');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[2]).toBe('AR');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[3]).toBe('BE');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[4]).toBe('BL');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[5]).toBe('BS');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[6]).toBe('FR');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[7]).toBe('GE');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[8]).toBe('GL');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[9]).toBe('GR');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[10]).toBe('JU');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[11]).toBe('LU');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[12]).toBe('NE');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[13]).toBe('NW');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[14]).toBe('OW');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[15]).toBe('SG');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[16]).toBe('SH');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[17]).toBe('SO');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[18]).toBe('SZ');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[19]).toBe('TG');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[20]).toBe('TI');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[21]).toBe('UR');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[22]).toBe('VD');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[23]).toBe('VS');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[24]).toBe('ZG');
		});

		it('should have XX as canton code', () => {
			expect(component.cantonCodes[25]).toBe('ZH');
		});
	});
});
