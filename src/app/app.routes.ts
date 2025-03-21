import { Routes } from '@angular/router';
import { LoginComponent } from './views/authentication/login/login.component';
import { SignUpComponent } from './views/authentication/sign-up/sign-up.component';
import { HomeComponent } from './views/dashboard/home/home.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EventsComponent } from './views/dashboard/events/events.component';
import { MembersComponent } from './views/dashboard/members/members.component';
import { PostsComponent } from './views/dashboard/posts/posts.component';
import { DonationsComponent } from './views/dashboard/donations/donations.component';
import { redirectUnauthorizedToLoginGuard } from './core/guards/redirect-unauthorized-to-login.guard';
import { redirectLoggedInToDashboardGuard } from './core/guards/redirect-logged-in-to-dashboard.guard';
import { VideosComponent } from './views/dashboard/videos/videos.component';
import { PrivacyPolicyComponent } from './views/privacy-policy/privacy-policy.component';
import { HomeComponent as HomeComponent2 } from './views/home/home.component';
import { VolunteerAdsComponent } from './views/dashboard/volunteer-ads/volunteer-ads.component';
import { UserPasswordResetComponent } from './views/authentication/user-password-reset/user-password-reset.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [redirectLoggedInToDashboardGuard],
  },
  {
    path: 'home',
    component: HomeComponent2,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'reset-user-password',
    component: UserPasswordResetComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [redirectUnauthorizedToLoginGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'events',
        component: EventsComponent,
      },
      {
        path: 'members',
        component: MembersComponent,
      },
      {
        path: 'news',
        component: PostsComponent,
      },
      {
        path: 'donations',
        component: DonationsComponent,
      },
      {
        path: 'videos',
        component: VideosComponent,
      },
      {
        path: 'volunteers',
        component: VolunteerAdsComponent,
      },
    ],
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
