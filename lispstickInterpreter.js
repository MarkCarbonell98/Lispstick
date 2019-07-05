const globalScope = require("./lispstickGlobalScope");
const evaluateProgram = require("./lispstickEvaluator");
const parse = require("./lispstickParser");

function interpretLispstick(programString) {
    return evaluateProgram(parse(programString), Object.create(globalScope))
}

module.exports = interpretLispstick
