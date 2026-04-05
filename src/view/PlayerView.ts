import type { PlayerController } from "../controller/PlayerController";
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

                <button id="reg-btn">Create Account & Start</button>
                <p id="error-msg" style="color: red; margin-top: 10px;"></p>
            </div>
        `;

        const userField = document.querySelector<HTMLInputElement>("#username")!;
        const passField = document.querySelector<HTMLInputElement>("#password")!;
        const regButton = document.querySelector<HTMLButtonElement>("#reg-btn")!;
        const toggleButton = document.querySelector<HTMLElement>("#togglePassword")!;
            
        const handleSubmit = () => {
            try {
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

        regButton.addEventListener("click", handleSubmit);

        const enterKeyHandler = (event: KeyboardEvent)=>{
            if(event.key === "Enter"){
                handleSubmit();
            }
        };
        
        userField.addEventListener("keydown", enterKeyHandler);
        passField.addEventListener("keydown", enterKeyHandler);

        toggleButton.addEventListener("click", () =>{
            const isPassword = passField.getAttribute("type") === "password";
            passField.setAttribute("type", isPassword ? "text" : "password");
            toggleButton.textContent = isPassword ? "👁" : "👁";
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