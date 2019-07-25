import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ExercisesComponent } from "./exercises/exercises.component";
import { VideoInputComponent } from "./video-input/video-input.component";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
	{
		path: "",
		component: LoginComponent,
		redirectTo: "login"
	},
	{
		path: "login",
		component: LoginComponent
	},
	{
		path: "dashboard",
		component: DashboardComponent
	},
	{
		path: "profile",
		component: ProfileComponent
	},
	{
		path: "exercises",
		component: ExercisesComponent
	},
	{
		path: "exercises/:name",
		component: VideoInputComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HomeRoutingModule { }
