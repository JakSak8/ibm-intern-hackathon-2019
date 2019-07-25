import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from '@angular/common/http';
import { EmbedVideo } from 'ngx-embed-video';

import { AppComponent } from "./app.component";
import { ListModule, RadioModule, GridModule, UIShellModule, DialogModule, ButtonModule } from "carbon-components-angular";

import { Home32Module } from '@carbon/icons-angular/lib/home/32';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		DialogModule,
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpModule,
		AppRoutingModule,
		ListModule,
		RadioModule,
		GridModule,
		UIShellModule,
		Home32Module,
		HttpClientModule,
		EmbedVideo.forRoot(),
		ButtonModule
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
