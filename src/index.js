import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Phaser from "phaser";
import Game from "./Components/Game";
import { render } from "@testing-library/react";
// moves Available
let Y = 25;
// field aspect
//x axis
let N = 6;
//y axis
let M = 6;
//color variety
let C = 5;
//needed blast size to activate special
let L = 7;
let minGroupBlast = 2;
let neededPoints = 100;
let shufflesAvailiable = 1;
let dynomiteRadius = 1;
const images = [];

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
let gamePhaser = new Phaser.Game(config);
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
  renderGrid(this, blastGame.state.boardArea, blastGame.state.aspectRatio.N, blastGame.state.aspectRatio.M);
  this.input.enabled = true;
}
function update() {}
function renderGrid(obj, boardArea, N, M){
  let x = 40;
  let y = 40;
  let stepX = 40;
  let stepY = 45;
  for (let i = 0; i < N; i++) {
    let tempX = x;
    for (let j = 0; j < M; j++){
      // renderTile(obj, boardArea[i][j], tempX, y).on('pointerdown', (el)=>{
        //   // blastGame.clickHandler(Math.floor(el.downY / 45), Math.floor(el.downX / 40));
        //   // blastGame.clickHandler(el.downY, el.downX);
        // })
      let tile = renderTile(obj, boardArea[i][j], tempX, y).setDataEnabled().setPipelineData('TileAddr', {I:i, J:j}).on('pointerdown', ()=> {
        blastGame.clickHandler(tile.pipelineData.TileAddr.I, tile.pipelineData.TileAddr.J);
      });
      tempX+=stepX;
    }
    y+=stepY;
    
  }
}
function renderTile(obj, value, x, y){
  let bgColor = '';
  switch (value) {
    case 1:
      bgColor = "greenTile";
      break;
    case 2:
      bgColor = "blueTile";
      break;
    case 3:
      bgColor = "purpleTile";
      break;
    case 4:
      bgColor = "redTile";
      break;
    case 5:
      bgColor = "yellowTile";
      break;
    case "specialTile":
      bgColor = "specialTile";
      break;
    default:
      break;
  }
  return (
    obj.add.image(x, y, bgColor).setScale(0.2).setInteractive()
  )
}