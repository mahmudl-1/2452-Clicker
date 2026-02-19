----
title: Flows of interaction for my clicker project
author: Mahmudl (mahmudl@myuamnitoba.ca)
date: Winter 2026
---

# Flows of interaction
```mermaid
flowchart 
    subgraph ClickCandy 
        DisplayMain[[Display Main Screen, CandyImage, Total Clicks, Upgrade store]]
        
        UpdateDisplay{Candy total clicks update}
        DisplayMain==Clicked Candy Image==>UpdateDisplay
        UpdateDisplay-.Increased total Clicks by Click damage.->DisplayMain
        
        checkPurchased{Checking Purchase history}
        checkTotalClicks{Checking required clicks available}
        DeductClicks{deducting clicks}
        ApplyUpgrade{Increase clickDamage}
        MarkPurchased[Making purchased true]
        DisplayMain==Clicked on a upgrade text==>checkPurchased
        checkPurchased-.Already Purchased before.->DisplayMain
        checkPurchased-.Not Purchased.-> checkTotalClicks
        checkTotalClicks-.Not sufficient clicks.->DisplayMain
        checkTotalClicks-.Sufficient, deducting money.-> DeductClicks
        DeductClicks-.Deducted, Applying.->ApplyUpgrade
        ApplyUpgrade-.Applied upgrade correctly.->MarkPurchased
        MarkPurchased-.Purchase complete.->UpdateDisplay
        
        
        DisplayMain==Clicked cross on tab==>End
        End[[Closing the tab]]
    end
```