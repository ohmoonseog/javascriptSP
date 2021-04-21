import {sum} from './math.js';
import './app.css';
import webpackImage from './webpack.png';
window.addEventListener('DOMContentLoaded', () => {
    const sum01 = sum(1,2);
    const el = document.querySelector('#app');
    el.innerHTML = `
    <h1> 1 +  2 = ${sum01} </h1>
    <img src="${webpackImage}" alt="webpack" />
    `;
})