import { accountExistAlready } from "../model/Exceptions/accountExistAlreadyException";
import { wrongPassword } from "../model/Exceptions/WrongPassword";
import { noAccountExist } from "../model/Exceptions/noAccountExistsException";
import { PlayerController } from "../controller/PlayerController";
import { InvalidPasswordException } from "../model/Exceptions/InvalidPasswordException";
import { InvalidUsernameException } from "../model/Exceptions/InvalidUsernameException";
import type { Listener } from "../model/Listeners";

//Used for signin then it is destroyed when signed in
export class PlayerView implements Listener {
  //main controller
  #controller: PlayerController;
  #app: HTMLElement;

  constructor(controller: PlayerController) {
    this.#controller = controller;
    this.#app = document.querySelector<HTMLElement>("#app")!;
    this.render();
  }

  //notify to clear the view when player is signed in
  notify(): void {
    this.#clear();
  }

  render() {
    //all styling lives in the css file (signin section)
    this.#app.innerHTML = `
      <div id="signin-container">
        <h1>Candy Clicker Sign in</h1>

        <div class="field">
          <input type="text" id="username" placeholder="Username"
            autocomplete="username" />
        </div>

        <div class="field field-password">
          <input type="password" id="password" placeholder="Password"
            autocomplete="current-password" />
          <button type="button" id="togglePassword" aria-label="Show password">
            👁
          </button>
        </div>

        <div class="signin-buttons">
          <button class="btn btn-primary" id="login-btn">Log In</button>
          <button class="btn btn-secondary" id="reg-btn">Create Account</button>
        </div>

        <p id="error-msg" role="alert"></p>
      </div>
    `;

    //for username and password
    const userField = document.querySelector<HTMLInputElement>("#username")!;
    const passField = document.querySelector<HTMLInputElement>("#password")!;
    //for the signin and login button
    const regButton = document.querySelector<HTMLButtonElement>("#reg-btn")!;
    const loginButton =
      document.querySelector<HTMLButtonElement>("#login-btn")!;
    //to show the password
    const toggleButton =
      document.querySelector<HTMLButtonElement>("#togglePassword")!;

    //handles new signin creating new accounts
    const handleSubmit = async () => {
      try {
        //couldn't use a notify as player didn't exist before the signin
        this.#showError("");
        await this.#controller.addPlayer(userField.value, passField.value);
        this.#controller.player.registerListener(this);
      } catch (e: any) {
        if (e instanceof InvalidUsernameException) {
          this.#showError("A username cannot be empty.");
        } else if (e instanceof InvalidPasswordException) {
          this.#showError("A password has to be more than 5 characters.");
        } else if (e instanceof accountExistAlready) {
          this.#showError("A account exist already with this name.");
        }
      }
    };

    //for existing players trying to login
    const handleLogin = async () => {
      this.#showError("");
      try {
        await this.#controller.existingPlayer(userField.value, passField.value);
      } catch (e: any) {
        if (e instanceof wrongPassword) {
          this.#showError("The password entered is wrong.");
        } else if (e instanceof noAccountExist) {
          this.#showError("No account exist of the given username.");
        } else if (e instanceof InvalidPasswordException) {
          this.#showError("A password has to be more than 5 characters.");
        } else if (e instanceof InvalidUsernameException) {
          this.#showError("A username cannot be empty.");
        }
      }
    };

    //connecting buttons with event listeners
    regButton.addEventListener("click", handleSubmit);
    loginButton.addEventListener("click", handleLogin);

    //connecting the showpassword setting the attribute to show text if password vice versa
    toggleButton.addEventListener("click", () => {
      const isPassword = passField.getAttribute("type") === "password";
      passField.setAttribute("type", isPassword ? "text" : "password");
      toggleButton.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
      );
    });
  }

  #showError(message: string) {
    //cannot render in the error message as player won't exist before entering the username and pass.
    const errorElement = document.querySelector("#error-msg");
    if (errorElement) errorElement.textContent = message;
  }

  #clear() {
    //removes the view
    this.#app.innerHTML = "";
  }
}
