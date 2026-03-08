import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <img src="/candy.png" class="logo" alt="Candy" />
    <h1>Click the Candy!</h1>

    <div class="box">
      <button id="counter" type="button"></button>
    </div>

    <p class="read">
      Click the candy to gain points
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
