import { noAccountExist, wrongPassword, type PlayerController } from "../controller/PlayerController";
import { InvalidPasswordException } from "../model/Exceptions/InvalidPasswordException";
import { InvalidUsernameException } from "../model/Exceptions/InvalidUsernameException";
import type { Listener } from "../model/Listeners";

export class PlayerView implements Listener{
    #controller: PlayerController;
    #app: HTMLElement;

    constructor(controller: PlayerController){
        this.#controller = controller;
        this.#app = document.querySelector<HTMLElement>("#app")!;
        this.render();
    }

    notify(): void {
        this.#clear();
    }

    render(){
        this.#app.innerHTML = `
            <div id="signin-container" style="text-align: center; margin-top: 50px;">
                <h1>Candy Clicker Sign in</h1>

                <div style="margin-bottom: 15px;">
                    <input type="text" id="username" placeholder="Username" 
                    style="padding: 10px; width: 250px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
                </div>

                <div style="margin-bottom: 15px; position: relative; display: inline-block;">
                    <input type="password" id="password" placeholder="Password" 
                    style="padding: 10px; width: 250px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
                    <span id="togglePassword" style="position: absolute; right: 10px; top: 5px; cursor: pointer; user-select: none;">
                        👁
                    </span>
                </div>

                <br>

                <div style="display: flex; justify-content: center; gap: 10px;">
                    <button id="login-btn">Log In</button>
                    <button id="reg-btn">Create Account</button>
                </div>

                <p id="error-msg" style="color: red; margin-top: 10px;"></p>
            </div>
        `;

        const userField = document.querySelector<HTMLInputElement>("#username")!;
        const passField = document.querySelector<HTMLInputElement>("#password")!;
        const regButton = document.querySelector<HTMLButtonElement>("#reg-btn")!;
        const loginButton = document.querySelector<HTMLButtonElement>("#login-btn")!;
        const toggleButton = document.querySelector<HTMLElement>("#togglePassword")!;
            
        const handleSubmit = () => {
            try {
                this.#showError("");
                this.#controller.addPlayer(userField.value, passField.value);
                this.#controller.player.registerListener(this);
            } catch (e: any) {
                if (e instanceof InvalidUsernameException) {
                    this.#showError("A username cannot be empty.");
                } else if (e instanceof InvalidPasswordException) {
                    this.#showError("A password has to be more than 5 characters.");
                } else {
                    this.#showError("An unexpected error occurred.");
                }
            }
        };

        const handleLogin = async () => {
            this.#showError("");

            if(userField.value.trim() === "" || passField.value.trim() === ""){
                this.#showError("Please enter both a username and password.");
            }else if(passField.value.length <= 5){
                this.#showError("The password entered is not long enough.");
            }else{
                try{
                   await this.#controller.existingPlayer(userField.value, passField.value);
            
                }catch(e: any){
                    if(e instanceof wrongPassword){
                        this.#showError("The password entered is wrong.");
                    }else if(e instanceof noAccountExist){
                        this.#showError("No account exist of the given username.");
                    }
                }
            }
        };

        regButton.addEventListener("click", handleSubmit);
        loginButton.addEventListener("click", handleLogin);

        toggleButton.addEventListener("click", () => {
            const isPassword = passField.getAttribute("type") === "password";
            passField.setAttribute("type", isPassword ? "text" : "password");
        });
    }

    #showError(message: string) {
        //cannot render in the error message as player won't exist before entering the username and pass.
        const errorElement = document.querySelector("#error-msg");
        if (errorElement) errorElement.textContent = message;
    }

    #clear(){
        this.#app.innerHTML = "";
    }
}