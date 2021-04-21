import hello_word from './hello.js';
import world_word from './world.js';
import _ from "lodash";
import css from './style.css';
console.log(_.join([hello_word,world_word],' 1'));
document.querySelector("#root").innerHTML = _.join([hello_word,world_word],' 1');