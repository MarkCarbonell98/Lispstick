const globalScope = Object.create(null)
const operators = {
    *[Symbol.iterator]() {
        const singleOperators = ["+", "-", "*", "/", "==", "<", ">", "<=", ">=", "===", "||", "&&"]
        for(let i = 0;  i< singleOperators.length; i++) {
            yield singleOperators[i]
        }
    }
}
globalScope.true = true
globalScope.false = false
globalScope.length = array => array.length;
globalScope.array = (...values) => values;
globalScope.element = (array, i) => array[i];
globalScope.print = value => value
for(const operator of operators) {
    globalScope[operator] = Function("a, b", `return a ${operator} b;`);
}

module.exports = globalScope;