const keywords = Object.create(null);

function evaluateProgram(expression, scope) {
    if(expression.type == 'value') {
        return expression.value;
    } else if(expression.type == 'string') {
        if(expression.characters in scope)
            return scope[expression.characters];
        throw new ReferenceError(`Undefined binding: ${expression.characters}`)
    } else if (expression.type == "binding") {
        const {operator, args} = expression;
        if (operator.type == 'string' && operator.characters in keywords) {
            return keywords[operator.characters](expression.args, scope);
        } else {
            const operation = evaluateProgram(operator, scope);
            if(typeof operation == 'function') {
                return operation(...args.map(argument => evaluateProgram(argument, scope)));
            } else {
                throw new TypeError("Cannot bind to a non function");
            }
        }
    }
}

keywords.set = (args, env) => {
    if(args.length != 2 || args[0].type != "string") {
        throw new SyntaxError("Bad use of set")
    }
    const variableName = args[0].characters
    const value = evaluateProgram(args[1], env);
    for(let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
        if(Object.prototype.hasOwnProperty.call(scope, variableName)) {
            scope[variableName] = value;
            return value;
        }
    }
    throw new ReferenceError("Setting of undefined variable " + variableName)
}

keywords.while = (args, scope) => {
    if(args.length != 2) {
        throw new SyntaxError("Wrong # of arguments on while")
    }
    while(evaluateProgram(args[0], scope) != false) {
        evaluateProgram(args[1], scope)
    }
    return false;
}

keywords.execute = (args, scope) => {
    let value = false;
    for(const arg of args) {
        value = evaluateProgram(arg, scope)
    }
    return value
}

keywords.declare = (args, scope) => {
    if (args.length != 2 || args[0].type != 'string') {
        throw new SyntaxError("Incorrect use of define")
    }
    const value = evaluateProgram(args[1], scope)
    scope[args[0].characters] = value
    return value
}

keywords.fun = (args, scope) => { 
    if(!args.length) {
        throw new SyntaxError("Function needs a body");
    }
    const functionBody = args[args.length -1];
    const params = args.slice(0, args.length -1).map(expression => {
        if(expression.type != "string") {
            throw new SyntaxError("Parameters must be words")
        }
        return expression.characters;
    })
    
    return function() {
        if(arguments.length != params.length) {
            throw new TypeError("wrong number of arguments")
        }
        const localScope = Object.create(scope)
        for(let i = 0; i < arguments.length; i++) {
            localScope[params[i]] = arguments[i];
        }
        return evaluateProgram(functionBody, localScope)
    }
}

keywords.if = (args, scope) => {
    if(args.length != 3) {
        throw new SyntaxError("Wrong number of args");
    } else if (evaluateProgram(args[0], scope) !== false) {
        return evaluateProgram(args[1], scope);
    } else {
        return evaluateProgram(args[2], scope);
    }
};


module.exports = evaluateProgram;