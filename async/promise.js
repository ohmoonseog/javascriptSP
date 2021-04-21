'use strict';
// Promise is a JavaScript object for asynchronous operations
// State : pending -> fulfilled or rejected 
// Producer vs Consumers

// 1. Producer
// when new Promise is created, the executor runs automatically
const promise = new Promise((resole,reject) => {
    // doing some heavy work (network, read files)
    console.log('doing something...');
    setTimeout(() =>{
        resole('ellie');
        //reject(new Error('no network'));
    },2000);
});

// 2. Consumers : then, catch, finally, then
promise.then((value) => {
    console.log(value);
}).catch(error => {
    console.log(error);
}).finally(() => {
    console.log('finally')
});
// 3. Promise chaining
const fetchNumber = new Promise((resole,reject) => {
    setTimeout(() => resole(1),1000);
});
fetchNumber
.then(num => num * 2)
.then(num => num * 3)
.then(num => {
    return new Promise((resole,reject) => setTimeout(() => resole(num -1 ),1000));
}).then(num => {
    console.log(num);
})

// 4. Error Handling
const getHen = () => 
    new Promise((resole,reject) => {
        setTimeout(() => resole('🐓'),1000);
    });
const getEgg = hen => 
    new Promise((resole,reject) => {
//        setTimeout(() => resole(`${hen} => 🥚`),1000);
        setTimeout(() => reject(new Error(`error ! ${hen} => 🥚`)),1000);
    });

const cook = egg => 
    new Promise((resole,reject) => {
        setTimeout(() => resole(`${egg} => 🌭`),1000);
    });


getHen() 
    .then(getEgg)
    .catch(error => {
        return '🩹'
    })
    .then(cook)
    .then(console.log)
    .catch(console.log);