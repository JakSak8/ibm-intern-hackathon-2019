import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent {

	username = "";
	password = "";

	constructor(private router: Router) {
	}

	validate() {
		this.router.navigate(["dashboard"]);
	}

}
