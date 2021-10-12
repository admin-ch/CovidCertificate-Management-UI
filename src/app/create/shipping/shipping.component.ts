import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {CreationDataService} from '../utils/creation-data.service';
import {GenerationType, Shipping, ShippingOptions} from 'shared/model';
import {DeliveryCodeValidatorValidators} from './delivery-code-validator';

@Component({
	selector: 'ec-shipping',
	templateUrl: './shipping.component.html',
	styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
	@Output() back = new EventEmitter<void>();
	@Output() next = new EventEmitter<void>();

	@ViewChild('formDirective') formDirective: FormGroupDirective;

	shippingForm: FormGroup;
	shippingOptions: string[] = Object.values(ShippingOptions);
	cantonCodes: string[] = [
		'AG',
		'AI',
		'AR',
		'BE',
		'BL',
		'BS',
		'FR',
		'GE',
		'GL',
		'GR',
		'JU',
		'LU',
		'NE',
		'NW',
		'OW',
		'SG',
		'SH',
		'SO',
		'SZ',
		'TG',
		'TI',
		'UR',
		'VD',
		'VS',
		'ZG',
		'ZH',
		'MI'
	];

	private inAppCodeConversionMap = {
		O: '0',
		G: '6',
		I: '1',
		J: '1',
		L: '1',
		Q: '9',
		V: 'U'
	};

	constructor(private readonly formBuilder: FormBuilder, private readonly dataService: CreationDataService) {}

	ngOnInit(): void {
		this.createForm();
		this.dataService.resetCalled.subscribe(() => {
			this.resetForm();
		});
		this.dataService.certificateTypeChanged.subscribe((certificateType: GenerationType) => {
			if (certificateType === GenerationType.TEST) {
				this.shippingOptions = [ShippingOptions.PDF, ShippingOptions.APP];
			} else {
				this.shippingOptions = Object.values(ShippingOptions);
			}
			this.resetForm();
		});
	}

	goBack(): void {
		this.back.emit();
	}

	goNext(): void {
		if (this.shippingForm.valid) {
			this.dataService.setNewShipping(this.mapFormToShippingData());
			this.next.emit();
		}
	}

	convertInAppCode(appCode: string): string {
		return [...appCode]
			.map(char => {
				const uppercaseChar = char.toUpperCase();
				if (this.inAppCodeConversionMap.hasOwnProperty(uppercaseChar)) {
					return this.inAppCodeConversionMap[uppercaseChar];
				}
				return char;
			})
			.join('');
	}

	private createForm(): void {
		this.initializeFields();
		this.handleShippingOptionChange();
	}

	private initializeFields(): void {
		this.shippingForm = this.formBuilder.group({
			shippingOption: [ShippingOptions.PDF, Validators.required],
			appDeliveryCode: [
				'',
				[
					Validators.required,
					Validators.maxLength(9),
					Validators.minLength(9),
					DeliveryCodeValidatorValidators.validateAppDeliveryCode()
				]
			],
			streetAndNr: ['', [Validators.required, Validators.maxLength(128)]],
			city: ['', [Validators.required, Validators.maxLength(128)]],
			cantonCodeSender: ['', [Validators.required, Validators.max(2), Validators.min(2)]],
			zipCode: ['', [Validators.required, Validators.max(9999), Validators.min(1000)]]
		});
	}

	private handleShippingOptionChange(): void {
		this.shippingForm.get('shippingOption').valueChanges.subscribe(newValue => {
			switch (newValue) {
				case ShippingOptions.APP:
					const appDeliveryCodeControl = this.shippingForm.get('appDeliveryCode');
					appDeliveryCodeControl.enable();
					appDeliveryCodeControl.valueChanges.subscribe(newValue =>
						appDeliveryCodeControl.setValue(this.convertInAppCode(newValue), {emitEvent: false})
					);
					this.disablePostDelivery();
					break;
				case ShippingOptions.POST:
					this.enablePostDelivery();
					this.disableInAppDelivery();
					break;
				default:
					this.disablePostDelivery();
					this.disableInAppDelivery();
					break;
			}
		});
	}

	private disableInAppDelivery(): void {
		this.disableField('appDeliveryCode');
	}

	private disablePostDelivery(): void {
		this.disableField('streetAndNr');
		this.disableField('city');
		this.disableField('cantonCodeSender');
		this.disableField('zipCode');
	}

	private disableField(fieldName: string): void {
		this.shippingForm.get(fieldName).setValue('');
		this.shippingForm.get(fieldName).disable();
	}

	private enablePostDelivery(): void {
		this.shippingForm.get('streetAndNr').enable();
		this.shippingForm.get('city').enable();
		this.shippingForm.get('cantonCodeSender').enable();
		this.shippingForm.get('zipCode').enable();
	}

	private resetForm(): void {
		this.formDirective.resetForm();
		this.shippingForm.reset({
			shippingOption: ShippingOptions.PDF
		});
	}

	private mapFormToShippingData(): Shipping {
		return {
			shippingOption: this.shippingForm.value.shippingOption,
			appDeliveryCode: this.shippingForm.value.appDeliveryCode,
			streetAndNr: this.shippingForm.value.streetAndNr,
			city: this.shippingForm.value.city,
			cantonCodeSender: this.shippingForm.value.cantonCodeSender,
			zipCode: this.shippingForm.value.zipCode
		};
	}
}
