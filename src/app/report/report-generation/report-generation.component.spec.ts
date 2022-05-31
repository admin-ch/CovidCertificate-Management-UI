import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {SharedModule} from "shared/shared.module";
import {ReportGenerationComponent} from "./report-generation.component";

describe('ReportGenerationComponent', () => {
	let component: ReportGenerationComponent;
	let fixture: ComponentFixture<ReportGenerationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObliqueTestingModule, SharedModule],
			providers: [],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
			declarations: [ReportGenerationComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportGenerationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges()
	});

	it('should create', () => {
		expect(component).toBeTruthy()
	});
});
