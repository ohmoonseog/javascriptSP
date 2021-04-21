'use strict';
// Array

// 1.Declaration
const arr1 = new Array();
const arr2 = [1, 2];

// 2. Index position
const fruits = ['🩰','👑','👙','👛👜','👝'];
console.log(fruits);
console.log(fruits.length);
let i  = 0;
console.log(fruits[i++]);
console.log(fruits[i++]);
console.log(fruits[i++]);
console.log(fruits[fruits.length - 1]);
console.clear();
for ( let i = 0; i < fruits.length; i ++) {
    console.log(fruits[i]);
}
console.log(`-----------------------------------`);
for ( let item of fruits) {
    console.log(item);
}
console.log(`-----------------------------------`);
fruits.forEach((item,index) => console.log(item));
console.log(`-----------------------------------`);
fruits.forEach((item,index,array) => console.log(item,index,array));
console.log(`-----------------------------------`);
console.log(fruits.join(`\n`));
console.log(`-----------------------------------`);
console.log(fruits.map((item,index)=> `item ${index + 1} = [${item}]`).join(`\n`));

// 4. Addtion, deletion, copy and
// push : add an item to end of array
console.clear();
fruits.push('🎈','🎆','🎇');
console.log('push ==>',fruits);
fruits.pop();
fruits.pop();
console.log('pop ==>',fruits);
fruits.unshift('1','2');
console.log('unshift ==>',fruits);
fruits.shift();
console.log('shift ==>',fruits);
fruits.shift();
console.log('shift ==>',fruits);
console.log(fruits);
console.clear();
console.log(`-----------------------------------`)
fruits.push('1','2','2');
console.log(fruits);
fruits.splice(1,1,'0','0');
console.log(fruits);

// combine two arrays
const fruits2 = ['🍕','🍔','🍟'];
const newFruits = fruits.concat(fruits2);
console.log(newFruits);


// 5.Searching
// find the index
console.clear();
console.log(fruits);
console.log(fruits.indexOf('1'));
console.log(fruits.indexOf('2'));
// includes
console.log(fruits.includes('2'));
console.log(fruits.includes('3'));
// lastIndexOf
console.log(fruits.indexOf('2'));
console.log(fruits.lastIndexOf('2'));

