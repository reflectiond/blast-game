import React from "react";

function GameOver(props) {
    if (props.isGameOver.Loose) {
      if (!props.isTurnExists) {
        return <div>Game Over! you lost (No available turns left)</div>;
      } else if (props.isTurnLeft === 0) {
        return <div>Game Over! you lost (No turns left)</div>;
      }
    } else if (props.isGameOver.Win) {
      return <div>Game Over! you win</div>;
    }
    return <div></div>;
  }

  export default GameOver;