import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home/home.component";
import { AccordionModule, TabsModule, TilesModule, GridModule, UIShellModule, ButtonModule, InputModule, ModalModule, RadioModule, LinkModule } from "carbon-components-angular";
import { VideoInputComponent } from "./video-input/video-input.component";
import { ExercisesComponent } from "./exercises/exercises.component";
import { LoginComponent } from "./login/login.component";
import { FormsModule } from "@angular/forms";
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HomeRoutingModule,
		AccordionModule,
		TabsModule,
		TilesModule,
		GridModule,
		UIShellModule,
		ButtonModule,
		InputModule,
		GridModule,
		ModalModule,
		RadioModule,
		LinkModule
	],
	declarations: [HomeComponent, LoginComponent, VideoInputComponent, ExercisesComponent, DashboardComponent, ProfileComponent]
})
export class HomeModule { }
