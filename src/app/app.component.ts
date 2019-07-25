import { Component, ViewEncapsulation, ViewChild } from "@angular/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	hamburger = false;

	hamburgerShow() {
		if(this.hamburger == false){
			this.hamburger = true;
		} else {
			this.hamburger = false;
		}
	}
}
