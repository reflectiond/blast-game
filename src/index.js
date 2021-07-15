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
  this.load.image("empty", "./assets/empty.png");
}
function create() {
  this.add.image(140, 155, "bg").setScale(0.17);
  this.grid = gameLogic.createArray(N, M);
  makeGrid(this, true);
  renderGrid(this);

  this.input.enabled = true;
}

function update() {}
function makeGrid(scope, isFirstLoad = false, prevGridState=null) {
  let col;
  let q = {indexToDelete: [], indexToUpdate: []}
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
      } else {
        tile = scope.grid[i][j];
        if(prevGridState[i][j]!==blastGame.state.boardArea[i][j]){
          q.indexToUpdate.push({i, j});
          col = i;
        }
        // tile.setTexture(
        //   createTileView(
        //     undefined,
        //     blastGame.state.boardArea[i][j],
        //     undefined,
        //     undefined,
        //     false
        //   )
        // );
      }

      if (blastGame.state.boardArea[i][j] === null) {
        q.indexToDelete.push({ i, j });

      }
      tile.setData("tileValue", blastGame.state.boardArea[i][j]);
      tile.setData("tileAddr", { I: i, J: j });
      
      scope.grid[i][j] = tile;
    }
  }
  console.log(q)
  return q;
 
}
function renderGrid(scope, qToDelete, qToUpdate) {
  if (qToDelete){
    qToDelete.map(element => {
      let tile = scope.grid[element.i][element.j]
      scope.tweens.add({
        targets: tile,
        angle: -360,
        ease: "Power3",
        duration: 1000,
        onComplete: ()=>{
          tile.setTexture(createTileView(undefined, blastGame.state.boardArea[element.i][element.j], undefined, undefined, false))
        }
      });
      
    });
    return;
  }
  if (qToUpdate){
    console.log(qToUpdate)
    qToUpdate.map(element => {
      let tile = scope.grid[element.i][element.j];
      tile.setY(tile.getData('y')-15);
      scope.tweens.add({
        targets: tile,
        y: tile.getData('y'),
        delay: 100,
        ease: "Power2",
        duration: 1500,
        onUpdate: ()=>tile.setTexture(createTileView(undefined, blastGame.state.boardArea[element.i][element.j], undefined, undefined, false))
      });
      
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
    let q = makeGrid(scope, false, copyBoard);
    renderGrid(scope, q.indexToDelete, undefined);

    blastGame.countPoints(blast.numberOfAvailiableBlasts);
    blastGame.isGameEnded();
    blastGame.state.turnsAvailable--;
    blastGame.isGameEnded();

    let boardAreaAfterMove = copyBoard;
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
        blastGame.state.aspectRatio.M
      );
    }
    blastGame.state.boardArea = boardAreaAfterMove;
    //render
    // makeGrid(scope, blastGame.state.boardArea);
    // renderGrid(scope);
    q = makeGrid(scope, false, blast.resultBoard);
    renderGrid(scope, undefined, q.indexToUpdate);
 
    updateAfterMove(boardAreaAfterMove, scope);
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
  blastGame.state.boardArea = boardAreaAfterReGenerate;
  let q = makeGrid(scope, false, boardAreaAfterMove);
  renderGrid(scope, undefined, q.indexToUpdate);
  if (
    !gameLogic.isAnyTileCanBeBlasted(
      boardAreaAfterReGenerate,
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
