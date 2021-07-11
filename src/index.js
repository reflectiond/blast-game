import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Phaser from "phaser";
import Game from "./Components/Game";
// moves Available
let Y = 25;
// field aspect
//x axis
let N = 5;
//y axis
let M = 5;
//color variety
let C = 5;
//needed blast size to activate special
let L = 7;
let minGroupBlast = 6;
let neededPoints = 100;
let shufflesAvailiable = 1;
let dynomiteRadius = 1;

let blastGame = new Game({
  NumberOfTurns: Y,
  aspectRatio: { N: N, M: M },
  colorVariaty: C,
  minGroupBlast: minGroupBlast,
  neededPoints: neededPoints,
  shufflesLeft: shufflesAvailiable,
  dynomiteRadius: dynomiteRadius,
  numberOfTilesToSpecial: L,
});
blastGame.makeFirstIterationBoardValid();

let config = {
  type: Phaser.CANVAS,
  width: 640,
  height: 800,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};
var gamePhaser = new Phaser.Game(config);
function preload() {
  this.load.image("blueTile", "./assets/blue.png");
  this.load.image("greenTile", "./assets/green.png");
  this.load.image("purpleTile", "./assets/purple.png");
  this.load.image("redTile", "./assets/red.png");
  this.load.image("yellowTile", "./assets/yellow.png");
  this.load.image("specialTile", "./assets/special.png");
  this.load.image("bg", "./assets/field.png");
}
function create() {
  const images = [];
  // const bg = this.add.image(170, 200, 'bg')
  const blueTile = this.add.image(200, 150, "blueTile");
  const greenTile = this.add.image(250, 200, "greenTile");
  const purpleTile = this.add.image(250, 200, "purpleTile");
  const redTile = this.add.image(250, 200, "redTile");
  const yellowTile = this.add.image(250, 200, "yellowTile");
  // const specialTile = this.add.image(250, 200, 'specialTile')
  images.push(blueTile, greenTile, purpleTile, redTile, yellowTile);
  images.map((el) => el.setScale(0.2).setVisible(true));
}
function update() {}
