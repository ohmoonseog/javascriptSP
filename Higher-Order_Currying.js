// Higher-Order_Currying

[1,2,3,4,5].forEach(num => console.log(num));
let persons = [
    { name: 'JE', age: 27 },
    { name: 'SJ', age: 34 },
    { name: 'HR', age: 38 },
    { name: 'YS', age: 27 }
  ];
let YB = persons.filter(person => person.age < 30);
 console.log(YB); // [{ name: 'JE', age: 27 }, { name: 'YS', age: 27 }]