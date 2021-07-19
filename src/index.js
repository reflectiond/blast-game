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
let Y = 1;
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
let neededPoints = 5;
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
  animateTile(this);
  this.input.enabled = true;
  this.isClickAllowed = true;
  this.isMakingGridNow = false;
  const style = { font: "bold 32px Arial", fill: "#fff" };
  this.text1 = this.add.text(330, 30, `MovesLeft: ${blastGame.state.turnsAvailable}`, style);
  this.text2 = this.add.text(330, 60, `ShufflesLeft: ${blastGame.state.shufflesLeft}`, style);
  this.text3 = this.add.text(330, 90, `PointsCollected: ${blastGame.state.storedPoints}`, style);
  this.text4 = this.add.text(330, 120, 'You won!',style).setAlpha(0);
  this.text5 = this.add.text(330, 120, 'You lost!',style).setAlpha(0);
  this.isGameEnded = false;
 
}
// console.log(gamePhaser.scene.scenes)
function update() {}
function makeGrid(scope, isFirstLoad = false) {
  scope.isMakingGridNow = true;
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
  scope.tempGrid = scope.grid.map(el => el.slice(0));
  scope.isMakingGridNow = false;
}
function afterClickEvent(scope, indexesToDeleteAnim, indexesToMoveAnim, indexesToGenerateAnim, indexesToShuffleAnim ){
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
      // scope.time.delayedCall(500 + k*200, ()=>clearTile(scope , i, j, ()=>createTileView(scope, blastGame.state.boardArea[i][j], undefined, undefined, false, i, j)), [], scope);
      scope.time.delayedCall(300 + k*100, ()=>clearTile(scope , i, j, ()=>console.log()), [], scope);
    }
  }
    if(indexesToMoveAnim){
      let cellsToAnimate = indexesToMoveAnim.map((el)=>
      {
          tile = scope.tempGrid[el.i][el.j];
          tile.setData('tileNewI', el.newI);
          return tile;
        })
      for (let k = 0; k < cellsToAnimate.length; k++) {
        let i = cellsToAnimate[k].getData('tileAddr').I;
        let j = cellsToAnimate[k].getData('tileAddr').J;
        let newI = cellsToAnimate[k].getData('tileNewI');
        scope.time.delayedCall(550, ()=>animateTile(scope, undefined, {i, j, newI}, undefined, undefined, () => makeGrid(scope)), [], scope);
        
      }
    }
    if(indexesToGenerateAnim){
      let cellsToAnimate = indexesToGenerateAnim.map((el)=>
      {
          return tile = scope.tempGrid[el.i][el.j];
      }
      )
      for (let k = 0; k < cellsToAnimate.length; k++) {
        let i = cellsToAnimate[k].getData('tileAddr').I;
        let j = cellsToAnimate[k].getData('tileAddr').J;
        // scope.time.delayedCall(500 + k*200, ()=>clearTile(scope , i, j, ()=>createTileView(scope, blastGame.state.boardArea[i][j], undefined, undefined, false, i, j)), [], scope);
        scope.time.delayedCall(2000, ()=>animateTile(scope , undefined, undefined, {i, j}, undefined, () => makeGrid(scope) ), [], scope);
      }
    }
    if(indexesToShuffleAnim){
      let cellsToAnimate = indexesToShuffleAnim.map((el)=>
      {
        tile = scope.tempGrid[el.i][el.j];

        return tile;
      }
      )
      for (let k = 0; k < cellsToAnimate.length; k++) {
        let i = cellsToAnimate[k].getData('tileAddr').I;
        let j = cellsToAnimate[k].getData('tileAddr').J;
        scope.time.delayedCall(5000, ()=>animateTile(scope , undefined, undefined, undefined,{ i, j}, () => makeGrid(scope) ), [], scope);
      }
    }

}
function animateTile(scope, tileToDelete, tileToMove, tileToGenerate, tileToShuffle, callback) {
  if (tileToDelete ){
      let tile = scope.grid[tileToDelete.i][tileToDelete.j]
      scope.tweens.add({
        targets: tile,
        angle: -360,
        ease: "Power3",
        duration: 1000,
        onComplete: ()=>{
          callback();
        }
      });

    return;
  }

  if (tileToMove){
      let tile = scope.grid[tileToMove.i][tileToMove.j];
      let oldY = tile.getData('y')
      scope.tweens.add({
        targets: tile,
        y: 40 + tileToMove.newI*45,
        delay: 800,
        ease: "Sine.easeIn",
        duration: 1000,
        onComplete: ()=>{
          tile.setY(oldY);
          callback();
        }
      });
    return;
  }
  if (tileToGenerate){
    let tile = scope.grid[tileToGenerate.i][tileToGenerate.j];
    scope.tweens.add({
      targets: tile,
      delay: 1000,
      angle: 360,
      ease: "Power2",
      duration: 1000,
      onComplete: ()=>{
        scope.isClickAllowed = true;
        callback();
      }
    });
    return;
  }
  if (tileToShuffle){
    let tile = scope.grid[tileToShuffle.i][tileToShuffle.j];
    let oldY = tile.getData('y')
    let oldX = tile.getData('x')
    scope.tweens.add({
      targets: tile,
      angle:360,
      scale: 0.02,
      delay: 800,
      ease: "Sine.easeIn",
      duration: 1000,
      onComplete: ()=>{
        callback();
        scope.tweens.add({
          targets: tile,
          angle: -360,
          scale:0.2,
          ease: "Sine.easeIn",
          duration: 1000,
        })
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
  scope.tweens.add({
    targets: [ scope.text1, scope.text2, scope.text2 ],
    alpha: 1,
    ease: 'Power3',
    delay: i
});
}
function clearTile(scope, i, j, callback) {
  scope.grid[i][j].setTexture("empty");
  callback();
}
function createTileView(scope, value, x, y, isFirstLoad = false) {
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
  
  return bgColor;
}
function isEnd(scope){
  if(blastGame.isGameEnded()){
    if (blastGame.state.gameOver.Win){
      scope.text4.setAlpha(1);
      scope.isGameEnded = true;
      return;
    }
    scope.text5.setAlpha(1);
    scope.isGameEnded = true;
  }
}
function clickHandler(scope, i, j) {
  if (scope.isClickAllowed && !scope.isGameEnded){
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
      console.log(blast.resultBoard, 'afterBlast')
      scope.isClickAllowed = false;
      afterClickEvent(scope, blast.indexesOfChangedTiles)


      blastGame.countPoints(blast.numberOfAvailiableBlasts);
      isEnd(scope);

      blastGame.state.turnsAvailable--;
      isEnd(scope);
      scope.text1.setText(`MovesLeft: ${blastGame.state.turnsAvailable}`);
      scope.text2.setText(`ShufflesLeft: ${blastGame.state.shufflesLeft}`);
      scope.text3.setText(`PointsCollected: ${blastGame.state.storedPoints}`);
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
      // makeGrid(scope, false, blast.resultBoard);
      // (scope, undefined, q.indexToUpdate);
      // makeGrid(scope, false, undefined, boardAreaAfterMove.indexesOfChangedTiles);
      afterClickEvent(scope, undefined, boardAreaAfterMove.indexesOfChangedTiles)
      updateAfterMove(boardAreaAfterMove.resultBoard, scope);
      
      console.log(scope.grid)
  }}
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
  console.log(boardAreaAfterReGenerate.resultBoard, 'after regenerate')
  
  afterClickEvent(scope, undefined, undefined, boardAreaAfterReGenerate.indexesOfChangedTiles)
  if (
    !gameLogic.isAnyTileCanBeBlasted(
      boardAreaAfterReGenerate.resultBoard,
      blastGame.state.aspectRatio.N,
      blastGame.state.aspectRatio.M,
      blastGame.state.minGroupBlast
      )
      ) {
        if (blastGame.state.shufflesLeft > 0) {
          if(scope.isMakingGridNow){
            while(scope.isMakingGridNow){
              continue;
            }
          }
      const boardAreaAfterShuffle = gameLogic.shuffleTiles(
        blastGame.state.boardArea,
        blastGame.state.aspectRatio.N,
        blastGame.state.aspectRatio.M,
        'casual'
        );
        blastGame.state.shufflesLeft--;
        scope.text1.setText(`MovesLeft: ${blastGame.state.turnsAvailable}`);
        scope.text2.setText(`ShufflesLeft: ${blastGame.state.shufflesLeft}`);
        scope.text3.setText(`PointsCollected: ${blastGame.state.storedPoints}`);
        blastGame.state.boardArea = boardAreaAfterShuffle.resultBoard;
        console.log(blastGame.state.boardArea, 'after shfl')
        // scope.time.delayedCall(4000, ()=>afterClickEvent(scope, undefined, undefined, undefined, boardAreaAfterShuffle.indexesOfChangedTiles), [], scope);
        // afterClickEvent(scope, undefined, undefined, undefined, boardAreaAfterShuffle.indexesOfChangedTiles);
      if (
        !gameLogic.isAnyTileCanBeBlasted(
          boardAreaAfterReGenerate.resultBoard,
          blastGame.state.aspectRatio.N,
          blastGame.state.aspectRatio.M,
          blastGame.state.minGroupBlast
        )
      ) {
        blastGame.state.turnExists = false;
        isEnd(scope);
      }
    } else {
      blastGame.state.turnExists = false;
      isEnd(scope);
    }
  }
}
