const { checkObjectLength } = require("../utils");

describe('Utility functions', () => {
    describe('Check object length', () => {
        it('Should return the length of the passed object into the function', () => {
            const testObj = { name: "Jack", age: 25, language: "Javascript"}
            expect(checkObjectLength(testObj)).toEqual(3)
        });
        
    });
});