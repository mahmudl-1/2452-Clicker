----
title: Domain Model for my clicker project
author: Mahmudl (mahmudl@myuamnitoba.ca)
date: Winter 2026
---

# Domain Model

```mermaid
classDiagram
    class Game{
        %% Assuming getters and constructors are placed
        - clicker: ClickableCandy
        - upgradeStore: UpgradeStore
        + click() void
        + buyUpgrade(id: string) boolean
        + getTotalClicks() number
    }
    note for Game "Invariant Properties
                    clicker and upgradeStore typeScript forces not null"   
    
    class ClickableCandy{
    %% Assuming getters and constructors are placed
        - totalClicks: number
        - clickDamage: number
        + click() void
        + increaseClickDamage(amount: number) void
        + spendClicks(amount: number) void
    }
    note for ClickableCandy "Invariant Properties
                             * totalClicks >= 0
                             * clickDamage >= 1"                            
    
    class UpgradeStore{
        - upgrades: Upgrade[]
        + getUpgrades() Upgrade[]
        + findUpgrade(id: string) Upgrade
    }
    %%length == 2 because exactly 2 upgrades required
    note for UpgradeStore "Invariant Properties
                           *upgrades.length == 2
                           *2 upgrades id shouldn't be same
                           *upgrades no null elements. Ts enforces no null"
                           
    class Upgrade{
        - id: string
        - name: string
        - cost: number
        - clickIncreaseEffect: number
        - purchased: boolean
        + purchase() void
        + isPurchased() boolean
    }
    note for Upgrade "Invariant Properties
                      *id.length > 0
                      *name.length >0
                      *cost >= 0
                      *clickIncreaseEffect >= 1
                      *purchase not null enforced by TS
                      *if purchase == true no purchase"   
    
%% Composition
    %%Game is composed of ClickableCandy and UpgradeStore
    Game --* ClickableCandy 
    Game --* UpgradeStore
%% Aggregation
    UpgradeStore --o Upgrade
    
```
