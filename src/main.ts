import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic([
	{provide: 'HOST', useValue: environment.host},
	{provide: 'NOTIFICATION_HOST', useValue: environment.notificationHost},
	{
		provide: 'IS_NOTIFICATION_SERVICE_ENABLED',
		useFactory: () => environment.stage === 'd' || environment.stage === 'a' || environment.stage === 'p'
		// use to test notification service locally
		// useFactory: () => true
	},
	{provide: 'REPORT_HOST', useValue: environment.reportHost},
	{provide: 'EIAM_SELF_ADMIN', useValue: environment.eiamSelfAdmin}
])
	.bootstrapModule(AppModule)
	.catch(err => console.error(err));
