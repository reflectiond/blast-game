import "./App.css";
import React from "react";
import Game from "./Components/Game.js";

// moves Available
let Y = 19;
// field aspect
//x axis
let N = 10;
//y axis
let M = 10;
//color variety
let C = 5;
//needed blast size to activate special
let L = 7;
let minGroupBlast = 2;
let neededPoints = 100;
let shufflesAvailiable = 1;
let dynomiteRadius = 1;

function App() {
  



  return (
    <div className="App">
      <Game
        NumberOfTurns={Y}
        aspectRatio={{ N: N, M: M }}
        colorVariaty={C}
        minGroupBlast={minGroupBlast}
        neededPoints={neededPoints}
        shufflesLeft={shufflesAvailiable}
        dynomiteRadius={dynomiteRadius}
        numberOfTilesToSpecial={L}
      />
    </div>
  );
}

export default App;
