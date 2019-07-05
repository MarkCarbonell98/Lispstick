function trimProgramBegin(programString) {
    const trimmedProgram = programString.match(/^(\s|#.*)*/)
    return programString.slice(trimmedProgram[0].length)
}

function parseProgram(expression, programString) {
    programString = trimProgramBegin(programString);
    if(programString[0] != "(") {
        return {expression, rest: programString};
    }
    programString = trimProgramBegin(programString.slice(1));
    expression = {type: "binding", operator: expression, args: []};
    while(programString[0] != ")") {
        const argument = parseNextExpression(programString);
        expression.args.push(argument.expression);
        programString = trimProgramBegin(argument.rest);
        if (programString[0] == ',') {
            programString = trimProgramBegin(programString.slice(1));
        } else if (programString[0] != ')') {
            throw new SyntaxError("Expected ',' or ')'");
        }
    }
    return parseProgram(expression, programString.slice(1));
}

function parseNextExpression(programString) {
    programString = trimProgramBegin(programString);
    let matchArray, expression;
    if(matchArray = /^"([^"]*)"/.exec(programString)) {
        expression = {type: "value", value: matchArray[1]};
    } else if (matchArray = /^\d+\b/.exec(programString)) {
        expression = {type: "value", value: Number(matchArray[0])};
    } else if(matchArray = /^[^\s(),#"]+/.exec(programString)) {
        expression = {type: "string", characters: matchArray[0]};
    } else {
        throw new SyntaxError("Incorrect syntax " + programString);
    }
    return parseProgram(expression, programString.slice(matchArray[0].length));
}

function parse(programString) {
    const {expression, rest} = parseNextExpression(programString);
    if(trimProgramBegin(rest).length >0) {
        throw new SyntaxError("Unrecognized characters in program");
    }
    return expression;
}

module.exports = parse