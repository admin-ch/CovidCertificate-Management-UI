import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './auth/auth-guard.service';

const routes: Routes = [
	{
		path: 'home',
		loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
	},
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
		canLoad: [AuthGuardService],
		canActivate: [AuthGuardService]
	},
	{
		path: 'certificate-create',
		loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
		canLoad: [AuthGuardService],
		canActivate: [AuthGuardService]
	},
	{
		path: 'certificate-revoke',
		loadChildren: () =>
			import('./certificate-revoke/certificate-revoke.module').then(m => m.CertificateRevokeModule),
		canLoad: [AuthGuardService],
		canActivate: [AuthGuardService]
	},
	{
		path: 'otp',
		loadChildren: () => import('./otp/otp.module').then(m => m.OtpModule),
		canLoad: [AuthGuardService],
		canActivate: [AuthGuardService]
	},
	{
		path: 'upload',
		loadChildren: () => import('./upload/upload.module').then(m => m.UploadModule),
		canLoad: [AuthGuardService],
		canActivate: [AuthGuardService]
	},
	{path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy'})],
	exports: [RouterModule]
})
export class AppRoutingModule {}
