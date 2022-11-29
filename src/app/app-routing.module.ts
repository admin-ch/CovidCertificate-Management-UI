import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './auth/auth-guard.service';
import {CreateGuard} from './create/create.guard';
import {CertificateRevokeGuard} from './certificate-revoke/certificate-revoke.guard';
import {OtpGuard} from './otp/otp.guard';
import {UploadGuard} from './upload/upload.guard';
import {ReportGuard} from './report/report.guard';
import {BulkRevocationGuard} from './bulk-revocation/bulkRevocation.guard';
import {NotificationsManagementGuard} from './notifications/notifications-management/notifications-management.guard';

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
		canLoad: [AuthGuardService, CreateGuard],
		canActivate: [AuthGuardService, CreateGuard]
	},
	{
		path: 'certificate-revoke',
		loadChildren: () => import('./certificate-revoke/certificate-revoke.module').then(m => m.CertificateRevokeModule),
		canLoad: [AuthGuardService, CertificateRevokeGuard],
		canActivate: [AuthGuardService, CertificateRevokeGuard]
	},
	{
		path: 'otp',
		loadChildren: () => import('./otp/otp.module').then(m => m.OtpModule),
		canLoad: [AuthGuardService, OtpGuard],
		canActivate: [AuthGuardService, OtpGuard]
	},
	{
		path: 'upload',
		loadChildren: () => import('./upload/upload.module').then(m => m.UploadModule),
		canLoad: [AuthGuardService, UploadGuard],
		canActivate: [AuthGuardService, UploadGuard]
	},
	{
		path: 'report',
		loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
		canLoad: [AuthGuardService, ReportGuard],
		canActivate: [AuthGuardService, ReportGuard]
	},
	{
		path: 'notifications-management',
		loadChildren: () => import('./notifications/notifications-management/notifications-management.module').then(m => m.NotificationsManagementModule),
		canLoad: [AuthGuardService, NotificationsManagementGuard],
		canActivate: [AuthGuardService, NotificationsManagementGuard]
	},
	{
		path: 'bulk-revocation',
		loadChildren: () => import('./bulk-revocation/bulkRevocation.module').then(m => m.BulkRevocationModule),
		canLoad: [AuthGuardService, BulkRevocationGuard],
		canActivate: [AuthGuardService, BulkRevocationGuard]
	},
	{path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy'})],
	exports: [RouterModule]
})
export class AppRoutingModule {}
