import { Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: "admin-home",
        component: AdminPageComponent
    },
    {
        path: "",
        component: AdminPageComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
