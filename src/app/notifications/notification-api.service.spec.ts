import { TestBed } from "@angular/core/testing";

import { NotificationApiService } from "./notification-api.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("NotificationApiService", () => {
	let service: NotificationApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [{ provide: "NOTIFICATION_HOST", useValue: "NOTIFICATION_HOST" }
			]
		});
		service = TestBed.inject(NotificationApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
