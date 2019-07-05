const lispstickInterpreter = require("./lispstickInterpreter");

console.log(lispstickInterpreter(`execute(declare(x, 10),
if(>(x, 5),
   print("large"),
   print("small")))`))

console.log(lispstickInterpreter(`execute(declare(total, 0),
declare(count, 1),
while(<(count, 11),
execute(declare(total, +(total, count)),
declare(count, +(count, 1)))),
print(total))
`))

console.log(lispstickInterpreter(`
execute(declare(plusOne, fun(a, +(a, 1))),
print(plusOne(10)))
`))

console.log(lispstickInterpreter(`
    execute(declare(pow, fun(base, exp,
    if(==(exp, 0),
    1,
    *(base, pow(base, -(exp, 1)))))),
    print(pow(2, 10)))
    `))


console.log(lispstickInterpreter(`
execute(declare(sum, fun(array,
    execute(declare(i, 0),
    declare(sum, 0),
    while(<(i, length(array)),
    execute(declare(sum, +(sum, element(array, i))),
    declare(i, +(i, 1)))),
    sum))),
    print(sum(array(1, 2, 3))))
    `))
    
console.log(lispstickInterpreter(`
execute(declare(x, 4),
declare(setx, fun(val, set(x, val))),
setx(50),
print(x))
`))