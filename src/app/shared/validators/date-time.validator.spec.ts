import {FormControl, FormGroup} from "@angular/forms";
import {getStartDateBeforeEndDateValidator} from "shared/validators/date-time.validator";
import * as moment from "moment";

describe('getStartDateBeforeEndDateValidator', () => {

	let formGroup: FormGroup
	let startControl: FormControl
	let endControl: FormControl

	beforeEach(() => {
		startControl = new FormControl('')
		endControl = new FormControl('')
		formGroup = new FormGroup({
			start: startControl,
			end: endControl
		})
	})

	it.each([
		[moment('2022-06-15'), moment('2022-06-15'), true],
		[moment('2022-06-10'), moment('2022-06-15'), true],
		[moment('2021-06-20'), moment('2022-06-15'), true],
		[moment('2022-06-16'), moment('2022-06-15'), false],
		[moment(''), moment('2022-06-15'), true],
		[moment('2022-06-15'), moment(''), true],
		[null, null, true],
	])(
		'when start is %s, and end is %s, control.valid should be %s',
		(start, end, valid) => {
			startControl.setValue(start)
			endControl.setValue(end)
			startControl.updateValueAndValidity()
			endControl.updateValueAndValidity()

			getStartDateBeforeEndDateValidator('start', 'end')(formGroup)

			expect(startControl.valid).toBe(valid)
			expect(endControl.valid).toBe(valid)
		}
	)

	it('should set formControl\'s error to null if no other errors are present' , () => {
		startControl.setValue(moment('2022-06-15'))
		endControl.setValue(moment('2022-06-15'))
		startControl.setErrors({startDateAfterEndDate:true})
		endControl.setErrors({startDateAfterEndDate:true})

		getStartDateBeforeEndDateValidator('start', 'end')(formGroup)

		expect(startControl.errors).toBe(null)
		expect(endControl.errors).toBe(null)

	});

	it('should remove only the startDateAfterEndDate error if formControl\'s have other errors' , () => {
		startControl.setValue(moment('2022-06-15'))
		endControl.setValue(moment('2022-06-15'))
		startControl.setErrors({startDateAfterEndDate:true, otherError: true})
		endControl.setErrors({startDateAfterEndDate:true, otherError: true})

		getStartDateBeforeEndDateValidator('start', 'end')(formGroup)

		expect(startControl.errors).toEqual({otherError: true})
		expect(endControl.errors).toEqual({otherError: true})
	});

});
