import { NgModule } from '@angular/core';
import { BuilderComponent } from './components/builder/builder.component';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AnswersComponent } from './components/answers/answers.component';

const routes: Routes = [
  {
    path: 'form', children: [
      { path: 'builder', component: BuilderComponent },
      { path: 'answers', component: AnswersComponent },
      { path: '', redirectTo: 'builder', pathMatch: 'full' }]
  },
  { path: '', redirectTo: 'form', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
