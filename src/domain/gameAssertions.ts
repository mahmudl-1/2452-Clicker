function assertClicksNotNeg(val: number) : asserts val is number{
    if(val<0){
        throw new Error("Total clicks cannot be negative.");
    }
}

function assertClickDmgPos(val: number): asserts val is number{
    if(val <= 0){
        throw new Error("Click Damage cannot be 0 or negative.")
    }
}

function assertAllUpgradesLenTwo(val: number): asserts val is number{
    if(val !== 2){
        throw new Error("All available upgrades should be exactly two.")
    }
}

function assertPurchasedUpgradesLenTwo(Pval: number, AllVal: number): asserts Pval is number{
    if(Pval > AllVal){
        throw new Error("Purchased upgrade should be equal or less than len of available upgrades.")
    }
}

