import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA, Inject, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTooltipModule} from '@angular/material/tooltip';
import {registerLocaleData} from '@angular/common';
import localeDECH from '@angular/common/locales/de-CH';
import localeFRCH from '@angular/common/locales/fr-CH';
import localeITCH from '@angular/common/locales/it-CH';
import localeENGB from '@angular/common/locales/en-GB';
import {TranslateModule} from '@ngx-translate/core';
import {
	OB_BANNER,
	ObDocumentMetaService,
	ObDropdownModule,
	ObHttpApiInterceptor,
	ObHttpApiInterceptorConfig,
	ObIconModule,
	ObMasterLayoutConfig,
	ObMasterLayoutModule,
	ObOffCanvasModule,
	multiTranslateLoader
} from '@oblique/oblique';
import {AuthModule} from 'angular-auth-oidc-client';
import {ObLanguageService} from 'shared/language.service';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpConfigInterceptor} from './auth/http.config.interceptor';
import {EiamSelfAdminComponent} from './eiam-self-admin/eiam-self-admin.component';
import {SharedModule} from 'shared/shared.module';
import {environment} from '../environments/environment';
import {HttpResponsesInterceptor} from 'shared/http/http-responses.interceptor';

registerLocaleData(localeDECH);
registerLocaleData(localeFRCH);
registerLocaleData(localeITCH);
registerLocaleData(localeENGB);

@NgModule({
	declarations: [AppComponent, EiamSelfAdminComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AppRoutingModule,
		SharedModule,
		TranslateModule.forRoot(multiTranslateLoader()),
		AuthModule.forRoot({
			config: {
				clientId: environment.oidc.clientId,
				authority: environment.oidc.authority,
				redirectUrl: `${environment.oidc.applicationUrl}${environment.oidc.loginFeedback}`,
				silentRenewUrl: `${environment.oidc.applicationUrl}assets/auth/silent-refresh.html`,
				postLogoutRedirectUri: environment.oidc.applicationUrl,
				postLoginRoute: `/${environment.oidc.afterLoginPath}`,
				logLevel: environment.oidc.debug,
				maxIdTokenIatOffsetAllowedInSeconds: environment.oidc.maxIdTokenIatOffsetAllowedInSeconds,
				responseType: 'code',
				startCheckSession: false,
				silentRenew: environment.oidc.silentRenew,
				autoUserInfo: true
			}
		}),
		ObMasterLayoutModule,
		ObOffCanvasModule,
		ObDropdownModule,
		MatTooltipModule,
		ObIconModule.forRoot(),
	],
	providers: [
		{provide: LOCALE_ID, useValue: 'de-CH'},
		{provide: HTTP_INTERCEPTORS, useClass: ObHttpApiInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: HttpResponsesInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true},
		{provide: OB_BANNER, useValue: environment.banner}
	],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
	constructor(
		private readonly config: ObMasterLayoutConfig,
		meta: ObDocumentMetaService,
		interceptor: ObHttpApiInterceptorConfig,
		@Inject('HOST') private readonly managementServiceHost: string
	) {
		ObLanguageService.locales.en = 'en-GB';
		interceptor.api.url = `${managementServiceHost}/api/v1`;
		interceptor.api.notification.active = false;
		meta.titleSuffix = 'application.title';
		config.homePageRoute = '/dashboard';
		config.locale.locales = [
			{id: 'locale-de_button', locale: 'de'},
			{id: 'locale-fr_button', locale: 'fr'},
			{id: 'locale-it_button', locale: 'it'},
			{id: 'locale-en_button', locale: 'en'}
		];
	}
}
