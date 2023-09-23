import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/pages/home'
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '/pages/home'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}