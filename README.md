----
title: My candy clicker
author: Mahmudl (mahmudl@myuamnitoba.ca)
date: Winter 2026
Course: Comp2452
----

# Candy Clicker
 
A browser-based incremental game inspired by *Cookie Clicker*, built for COMP 2452 (Winter 2026).
 
Click the candy to earn points, then spend them on **upgrades** that boost your clicking power or **buildings** that click for you automatically. Create an account to save your progress and pick up exactly where you left off when you log back in.
 
## Features
 
- **Click to play:** every click on the candy adds to your total.
- **Upgrades:** permanently increase the value of each click.
- **Buildings:** generate clicks automatically every second.
  - *Candy Store* (basic): 1 click per second
  - *Candy Factory* (advanced): 10 clicks per second
- **Accounts:** register with a username and password, and log back in at any time.
- **Automatic saving:** progress is saved whenever your game changes, and again when the tab is closed or hidden.
- **Secure passwords:** passwords are salted and hashed with PBKDF2 (SHA-256) and never stored in plain text.
## Getting Started
 
### Prerequisites
 
- [Node.js](https://nodejs.org/) and npm
### Installation and Running
 
```bash
npm install
npx vite
```
 
Then open the local address that Vite prints in your terminal (usually `http://localhost:5173`).
 
### How to Play
 
1. On first launch, choose **Create Account** and enter a new username and a password of more than 5 characters.
2. Click the candy to earn points.
3. Spend points in the store on upgrades and buildings.
4. Next time, use **Log In** with the same credentials to resume your game.
## Documentation
 
| Document | Description |
| --- | --- |
| [`domain.md`](./domain.md) | Domain model |
| [`flows.md`](./flows.md) | User interaction flows |
| [`create-tables.sql`](./create-tables.sql) | Database schema |
 
## Project Structure
 
The project follows an MVC-style layout:
 
- **`model/`**: game state and rules (`Game`, `Player`, buildings, upgrades) and database access
- **`view/`**: UI rendering (`PlayerView` for sign-in, `GameView` for the game screen)
- **`controller/`**: coordinates the model and views (`PlayerController` for authentication and saving, `GameController` for gameplay)
## Tech Stack
 
- TypeScript
- Vite
- SQL database (schema in `create-tables.sql`)
- Web Crypto API for password hashing
## Course Information
https://umanitoba.ca/
Developed for **COMP 2452**, Winter 2026.

