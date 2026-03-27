//Assert function which takes a boolean expression and a error message, if 
//the assertion fails then the error will be thrown
export function assert(val: any, message: string): asserts val{
    if(!val){
        throw new AssertionError(message);
    }
}

//Custom error created
export class AssertionError extends Error{
    constructor(message: string){
        super(message);
    }
}