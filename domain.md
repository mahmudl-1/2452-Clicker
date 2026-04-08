----
title: Domain Model for my clicker project
author: Mahmudl (mahmudl@myuamnitoba.ca)
date: Winter 2026
---

# Domain Model
Changes in the domain model since phase 1:

*Player class has been added for account management.

*Game class has id included and the buildings upgrade included.

*Game class has made all the upgrades made into array so it can be made
into more distinct upgrades later on if needed.

*Purchasable interface has been added on upgrades and buildings.

*2 types of buildings such as basic building and advanced building 
has been added.

*Relationships has been updated to include back referencing and cardinality.
restraints have been added on certain variables.

*Invariant properties have been updated.
```mermaid
classDiagram
    class Player{
        -~username: string
        -~password: string
        -game: Game
        +validatePass(pass: string): Promise<boolean>
        %%listener pattern
        %%+createGameAccount(): void
        %%+login(): void
        %%loaders,savers,getters,setters
    }
    note for Player "Invariant Properties
                     *username.length > 0
                     *password.length > 5"   
    class Game{
        %% Assuming getters and constructors are placed
        -~ id: number
        - totalClicks: number
        - clickDamage: number
        - upgradeADD: UpgradeADD[]
        - upgradeMULT: UpgradeMULT[]
        - basicBuilding: BasicBuilding[]
        - AdvancedBuilding: AdvancedBuilding[]
        %%name changed to inventory for cleaner name
        - Inventory: Purchasable[] 
        %%controller calls this for auto click through setInterval
        %%While implementing, I found this method was necessary
        + autoClickTick() void
        + click() void
        %%Implements the upgrade, increases clicks and spends clicks
        %%calls Upgrade apply
        + buyPurchasable(item: Purchasable) void
    }
    note for Game "Invariant Properties
                    *totalClicks >= 0
                    *clickDamage > 0 
                    *check each array not null"
    class Purchasable{
        <<interface>>
        +~name: string
        +?description: string
        %%back reference
        +game: Game
        +cost: number
    }
    note for Purchasable "Invariant Properties
                          None since it is an interface"
                          
    %%Upgrades Hierarchy                      
    class Upgrade{
       <<interface>>
       +apply(Game: game) number
    }
    
    note for Upgrade "Invariant Properties
                      None since it is an interface"
    
    class UpgradeADD{
        -~name: string
        -game: Game
        -?description: string
        -cost: number
        -effect: number
        +apply(game: Game) number
    }
    
    note for UpgradeADD "Invariant Properties
                         *name.length >0
                         *cost > 0
                         *effect > 0
                         *description.length > 0 if not null
                        "       
    
    class UpgradeMULT{
        -~name: string
        -game: Game
        -?description: string
        -cost: number
        -multFactor: number
        +apply(game: Game) number
    }
    
    note for UpgradeMULT "Invariant Properties
                          *name.length >0
                          *cost >0 
                          *multFactor > 1
                          *description.length > 0 if not null
                          "
                          
    %%Buildings Hierarchy
    class Building{
        <<interface>>
        -clicksPerSecond: number
        +produceClicks() number
    }
    note for Building "Invariant Properties
                        None since it is an interface"
                        
    class BasicBuilding{
        -~name: string
        -?description: string
        -cost: number
        -game: Game
        -clicksPerSecond: number
        +produceClicks() number
    }                    
    note for BasicBuilding "Invariant Properties
                            *name.length > 0
                            *cost > 0
                            *description.length > 0 if not null
                            *clicksPerSecond === 1
                            "
                            
    class AdvancedBuilding{
        -~name: string
        -?description: string
        -cost: number
        -game: Game
        -clicksPerSecond: number
        +produceClicks() number
    }                        
    note for AdvancedBuilding "Invariant Properties
                               *clicksPerSecond = 10
                               *name.length > 0
                               *cost > 0
                               *description.length > 0 if not null"
    %%set interval will be used in controller
 %%Cardinality composition
    Player "1" --* "1" Game
 
    Game "1" --* "+" UpgradeADD
    Game "1" --* "+" UpgradeMULT
    
    Game "1" --* "+" BasicBuilding
    Game "1" --* "+" AdvancedBuilding
    
%% cardinality aggregation
    Game "1" --o "1" Player

    UpgradeADD "1" --o "1" Game
    UpgradeMULT "1" --o "1" Game
    
    BasicBuilding "1" --o "1" Game
    AdvancedBuilding "1" --o "1" Game
%% Implements
    Upgrade --|> Purchasable
    Building --|> Purchasable
    
    UpgradeADD --|> Upgrade
    UpgradeMULT --|> Upgrade
    
    BasicBuilding --|> Building
    AdvancedBuilding --|> Building
    
```
