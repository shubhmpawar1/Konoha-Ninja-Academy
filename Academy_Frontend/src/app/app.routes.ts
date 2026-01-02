import { Routes } from '@angular/router';
import { Instructors } from './features/instructors/instructors';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'instructors', component: Instructors },
];