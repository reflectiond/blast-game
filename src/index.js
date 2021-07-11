import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Phaser from 'phaser';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
  let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 800,
    scene:{ 
      preload: preload, 
      create: create,
      update: update
    }
  };
  var game = new Phaser.Game(config);
  function preload() {
    this.load.image('blueTile', './assets/blue.png')
    this.load.image('greenTile', './assets/green.png')
    this.load.image('purpleTile', './assets/purple.png')
    this.load.image('redTile', './assets/red.png')
    this.load.image('yellowTile', './assets/yellow.png')
    this.load.image('specialTile', './assets/special.png')
    this.load.image('bg', './assets/field.png')
  }
  function create() {
    const images = [];
    const bg = this.add.image(170, 200, 'bg')
    bg.setScale(0.2)
    const blueTile = this.add.image(200, 150, 'blueTile');
    const greenTile = this.add.image(250, 200, 'greenTile')
    const purpleTile = this.add.image(250, 200, 'purpleTile')
    const redTile = this.add.image(250, 200, 'redTile')
    const yellowTile = this.add.image(250, 200, 'yellowTile')
    // const specialTile = this.add.image(250, 200, 'specialTile')
    images.push(blueTile, greenTile, purpleTile, redTile, yellowTile);
    images.map(el => el.setScale(0.2).setVisible(false));
    
  }
  function update() {}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
