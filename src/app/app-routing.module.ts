import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExampleComponent } from './components/example/example.component';

const routes: Routes = [
  {
    path: '',
    component: ExampleComponent,
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'product',
      },
      {
        path: 'product',
        loadChildren: () => import('./pages/product/product.module').then((m) => m.ProductModule),
      },
      {
        path: 'radio',
        loadChildren: () => import('./pages/radio/radio.module').then((m) => m.RadioModule),
      },
      {
        path: 'library',
        loadChildren: () => import('./pages/library/library.module').then((m) => m.LibraryModule),
      },
      {
        path: 'search',
        loadChildren: () => import('./pages/search/search.module').then((m) => m.SearchModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
