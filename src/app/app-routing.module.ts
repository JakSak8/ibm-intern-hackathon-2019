import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Routes
const routes: Routes = [
	{
		path: "",
		loadChildren: "app/home/home.module#HomeModule"
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
