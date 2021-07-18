import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Phaser from "phaser";
import Game from "./Components/Game";
import { render } from "@testing-library/react";
import GameLogic from "./Components/GameLogic";
let gameLogic = new GameLogic();
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
let L = 999;
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
  this.load.image("empty", "./assets/empty.png");
}
function create() {
  this.add.sprite(140, 155, "bg").setScale(0.2);
  // console.log()
  // bg.animations.play('wobble');
  this.grid = gameLogic.createArray(N, M);
  makeGrid(this, true);
  this.tempGrid = this.grid.map(el => el.slice(0));
  console.log(this.grid, this.tempGrid)
  animateTile(this);
  this.input.enabled = true;
}
// console.log(gamePhaser.scene.scenes)
function update() {}
function makeGrid(scope, isFirstLoad = false) {
  // let q = {indexToDelete: [], indexToUpdate: []}
  for (let i = 0; i < blastGame.state.aspectRatio.N; i++) {
    for (let j = 0; j < blastGame.state.aspectRatio.M; j++) {
      let sx = 40 + j * 40;
      let sy = 40 + i * 45;
      let tile = {};
      if (isFirstLoad === true) {
        tile = createTileView(
          scope,
          blastGame.state.boardArea[i][j],
          sx,
          sy,
          isFirstLoad
          );
          tile.setAlpha(0);
          tile.setData('y', sy)
          tile.on("pointerdown", () => {
            clickHandler(
              scope,
              tile.getData("tileAddr").I,
              tile.getData("tileAddr").J
              );
            });
          } else{
            tile = scope.grid[i][j];
            tile.setTexture(createTileView(scope, blastGame.state.boardArea[i][j], undefined, undefined, false))
          }
          tile.setData("tileValue", blastGame.state.boardArea[i][j]);
          tile.setData("tileAddr", { I: i, J: j });
          scope.grid[i][j] = tile;
          
          
          
            
    }
  }
  // return q;
 
}
function afterClickEvent(scope, indexesToDeleteAnim, indexesToMoveAnim, indexesToGenerateAnim ){
  let tile = {};
  if(indexesToDeleteAnim){
    let cellsToAnimate = indexesToDeleteAnim.map((el)=>
    {
        return tile = scope.tempGrid[el.i][el.j];
    }
    )
    for (let k = 0; k < cellsToAnimate.length; k++) {
      let i = cellsToAnimate[k].getData('tileAddr').I;
      let j = cellsToAnimate[k].getData('tileAddr').J;
      scope.time.delayedCall(500 + k*200, ()=>clearTile(scope , i, j, ()=>createTileView(scope, blastGame.state.boardArea[i][j], undefined, undefined, false, i, j)), [], scope);
    }
  }
    if(indexesToMoveAnim){
      let cellsToAnimate = indexesToMoveAnim.map((el)=>
      {
          return tile = scope.tempGrid[el.i][el.j];
        })
      for (let k = 0; k < cellsToAnimate.length; k++) {
        let i = cellsToAnimate[k].getData('tileAddr').I;
        let j = cellsToAnimate[k].getData('tileAddr').J;
        scope.time.delayedCall(550, ()=>animateTile(scope, undefined, {i, j}, undefined, () => createTileView(scope, blastGame.state.boardArea[i][j], undefined, undefined, false, i, j)), [], scope);
        
      }
    }
    if(indexesToGenerateAnim){
      indexesToGenerateAnim.map((el)=>
      {
        tile = scope.tempGrid[el.i][el.j];
        animateTile(scope, undefined, undefined, {i:el.i, j:el.j}, () => tile.setTexture(createTileView(undefined, blastGame.state.boardArea[el.i][el.j], undefined, undefined, false)))
      })
    }
}
function animateTile(scope, tileToDelete, tileToMove, tileToGenerate, callback) {
  if (tileToDelete ){
      let tile = scope.grid[tileToDelete.i][tileToDelete.j]
      scope.tweens.add({
        targets: tile,
        angle: -360,
        // alpha: 0,
        ease: "Power3",
        duration: 1000,
        onComplete: ()=>{
          // tile.setAlpha(1)
          callback();
        }
      });
      // scope.tweens.add({
      //   targets: tile,
      //   angle: -360,
      //   alpha: 1,
      //   ease: "Power3",
      //   duration: 600,

      // });
    return;
  }

  if (tileToMove){
      let tile = scope.grid[tileToMove.i][tileToMove.j];
      tile.setY(tile.getData('y')-20);
      scope.tweens.add({
        targets: tile,
        y: tile.getData('y'),
        delay: 2000,
        ease: "Power2",
        duration: 1500,
        onComplete: ()=>{
          callback();
        }
      });
    return;
  }
  if (tileToGenerate){
    let tile = scope.grid[tileToGenerate.i][tileToGenerate.j];
    console.log(tile, 'tile to animate gen')
    // tile.setAlpha(0) 
    scope.tweens.add({
      targets: tile,
      delay: 300,
      // alpha: 1,
      angle: 360,
      ease: "Power2",
      duration: 1000,
      onUpdate: ()=>{
        callback();
      }
    });
    return;
  }
  let i = 800;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < M; x++) {
      let tile = scope.grid[x][y];
      scope.tweens.add({
        targets: tile,
        alpha: 1,
        
        ease: "Power3",
        duration: 1500,
        delay: i,
      });

      i += 20;
    }
  }
  i -= 1000;
}
function clearTile(scope, i, j, callback) {
  scope.grid[i][j].setTexture("empty");
  callback();
}
function createTileView(scope, value, x, y, isFirstLoad = false, i, j) {
  let bgColor = "";
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
    case null:
      bgColor = "empty";
    default:
      break;
  }
  if (isFirstLoad) {
    return scope.add.image(x, y, bgColor).setScale(0.2).setInteractive();
  }
  
  return scope.grid[i][j].setTexture(bgColor);
}

function clickHandler(scope, i, j) {
  const copyBoard = blastGame.state.boardArea.map((el) => el.slice(0));
  console.log("clicked ", i, j, copyBoard);
  const blast = gameLogic.blastTile(
    copyBoard,
    i,
    j,
    blastGame.state.aspectRatio.N,
    blastGame.state.aspectRatio.M
  );

  if (blast.numberOfAvailiableBlasts >= blastGame.state.minGroupBlast) {
    blastGame.state.boardArea = blast.resultBoard;
    //render
    //makeGrid(scope, false, blast.indexesOfChangedTiles);
    afterClickEvent(scope, blast.indexesOfChangedTiles)
    // animateTile(scope, q.indexToDelete, undefined);

    blastGame.countPoints(blast.numberOfAvailiableBlasts);
    blastGame.isGameEnded();
    blastGame.state.turnsAvailable--;
    blastGame.isGameEnded();

    let boardAreaAfterMove;
    if (
      blast.numberOfAvailiableBlasts > blastGame.state.numberOfTilesToSpecial
    ) {
      const boardAfterBigBlast = gameLogic.generateSpecialValue(
        blast.resultBoard,
        i,
        j
      );
      //render
      boardAreaAfterMove = gameLogic.moveAfterBlast(
        boardAfterBigBlast,
        blastGame.state.aspectRatio.N,
        blastGame.state.aspectRatio.M
      );
      //render
    } else {
      boardAreaAfterMove = gameLogic.moveAfterBlast(
        blast.resultBoard,
        blastGame.state.aspectRatio.N,
        blastGame.state.aspectRatio.M,
        blast.indexesOfChangedTiles
      );
    }
    blastGame.state.boardArea = boardAreaAfterMove.resultBoard;
    //render
    // makeGrid(scope, blastGame.state.boardArea);
    // animateTile(scope);
    // makeGrid(scope, false, blast.resultBoard);
    // animateTile(scope, undefined, q.indexToUpdate);
    // makeGrid(scope, false, undefined, boardAreaAfterMove.indexesOfChangedTiles);
    afterClickEvent(scope, undefined, boardAreaAfterMove.indexesOfChangedTiles)
    updateAfterMove(boardAreaAfterMove.resultBoard, scope);
    console.log(blastGame.state.boardArea);
  }
}

function specialClickHandler(i, j) {
  const copyBoard = this.state.boardArea.map((el) => el.slice(0));
  const blast = gameLogic.blastTile(
    copyBoard,
    i,
    j,
    blastGame.state.aspectRatio.N,
    blastGame.state.aspectRatio.M,
    "special"
  );
  blastGame.state.boardArea = blast.resultBoard;

  blastGame.countPoints(4);
  blastGame.state.turnsAvailable--;
  blastGame.isGameEnded();

  const boardAreaAfterMove = blastGame.moveAfterBlast(blast.resultBoard);
  blastGame.state.boardArea = boardAreaAfterMove;

  updateAfterMove(boardAreaAfterMove);
}
function dynomiteClickHandler(i, j) {
  const copyBoard = blastGame.state.boardArea.map((el) => el.slice(0));
  const dynomite = gameLogic.blastTile(
    copyBoard,
    i,
    j,
    blastGame.state.aspectRatio.N,
    blastGame.state.aspectRatio.M,
    "dynomite",
    blastGame.state.dynomiteRadius
  );

  blastGame.state.boardArea = dynomite.resultBoard;

  blastGame.countPoints(dynomite.numberOfAvailiableBlasts * 0.5);
  blastGame.isGameEnded();
  blastGame.state.turnsAvailable--;
  blastGame.isGameEnded();
}
function updateAfterMove(boardAreaAfterMove, scope) {
  const boardAreaAfterReGenerate = gameLogic.generateValuesAfterBlast(
    boardAreaAfterMove,
    blastGame.state.aspectRatio.N,
    blastGame.state.aspectRatio.M,
    blastGame.state.colorVariaty
  );
  blastGame.state.boardArea = boardAreaAfterReGenerate.resultBoard;
  // makeGrid(scope, false, undefined, undefined, boardAreaAfterReGenerate.indexesOfChangedTiles);
  // animateTile(scope, undefined, q.indexToUpdate);
  if (
    !gameLogic.isAnyTileCanBeBlasted(
      boardAreaAfterReGenerate.resultBoard,
      blastGame.state.aspectRatio.N,
      blastGame.state.aspectRatio.M,
      blastGame.state.minGroupBlast
    )
  ) {
    if (blastGame.state.shufflesLeft > 0) {
      const boardAreaAfterShuffle = gameLogic.shuffleTiles(
        boardAreaAfterReGenerate,
        blastGame.state.aspectRatio.N,
        blastGame.state.aspectRatio.M
      );
      blastGame.state.shufflesLeft--;
      blastGame.state.boardArea = boardAreaAfterShuffle;
      if (
        !gameLogic.isAnyTileCanBeBlasted(
          boardAreaAfterReGenerate,
          blastGame.state.aspectRatio.N,
          blastGame.state.aspectRatio.M,
          blastGame.state.minGroupBlast
        )
      ) {
        blastGame.state.turnExists = false;
        blastGame.isGameEnded();
      }
    } else {
      blastGame.state.turnExists = false;
      blastGame.isGameEnded();
    }
  }
}
