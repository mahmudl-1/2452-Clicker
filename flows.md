----
title: Flows of interaction for my clicker project
author: Mahmudl (mahmudl@myuamnitoba.ca)
date: Winter 2026
---
# Flows of interaction
Changes since phase 1:

*Account creation and account login interaction made

*Game chart have been updated to include autoclicking
### Phase 2

```mermaid
flowchart
    subgraph Game 
        DisplayMain[[Display Main screen: Candy, Upgrades, building purchases]]
        updated{Candy total clicks Updating}
        passivelyClick[Click Candy per second]
        DisplayMain ==Candy Clicked==> updated
        DisplayMain ==upgrades clicked==> updated
        DisplayMain ==buildings purchasable clicked==> updated
        updated -.not enough clicks.->DisplayMain
        updated -.buildings purchased.->passivelyClick
        passivelyClick -.Clicking on intervals.->updated
        updated -.updated total clicks.-> DisplayMain
    end
    
```

```mermaid
flowchart
    subgraph AccountCreation
        DisplayAccountField[[Username Field, Password Field, Prompts: indicating enter pass word and username, password restrictions, username restrictions]]
        processInformation{Authenticate restrictions}
        DisplayMain[[Display Main Screen]]
        
        DisplayAccountField ==Entered new Username, Password==>processInformation
        processInformation -.requirements not fulfilled.-> DisplayAccountField
        processInformation -.Username already taken.->DisplayAccountField
        processInformation -.Starting new Game.->DisplayMain
    end
```




```mermaid
flowchart
    subgraph AccountLogin 
        DisplayAccountField[[Username Field, Password Field, Prompts: indicating enter pass word and username]]
        processInformation{Authenticate info}
        DisplayMain[[Display Main Screen]]
        
        DisplayAccountField==Entered Username, Password==>processInformation
        processInformation-.wrong username.-> DisplayAccountField
        processInformation-.wrong Password.->DisplayAccountField
        processInformation-.Loading Player's Game state.->DisplayMain
    end
```


### Updated after feedback Phase 1
```mermaid
flowchart 
    subgraph ClickCandy 
        DisplayMain[[Display Main Screen, CandyImage, Total Clicks, Upgrade store]]
        
        UpdateDisplay{Candy total clicks update}
        DisplayMain==Clicked Candy Image==>UpdateDisplay
        UpdateDisplay-.Increased total Clicks by Click damage.->DisplayMain
        
        DisplayMain==Clicked on a upgrade text==>UpdateDisplay
        UpdateDisplay-.Already Purchased before.->DisplayMain
        UpdateDisplay-.Not sufficient clicks.->DisplayMain
    end
```