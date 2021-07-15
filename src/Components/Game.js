import GameLogic from "./GameLogic";
let gameLogic = new GameLogic();

class Game {
  constructor(props) {
    this.state = {
      turnsAvailable: props.NumberOfTurns,
      aspectRatio: { N: props.aspectRatio.N, M: props.aspectRatio.M },
      colorVariaty: props.colorVariaty,
      minGroupBlast: props.minGroupBlast,
      storedPoints: 0,
      neededPoints: props.neededPoints,
      dynomiteRadius: props.dynomiteRadius,
      boardArea: gameLogic.createBoardArray(
        props.aspectRatio.N,
        props.aspectRatio.M,
        props.colorVariaty
      ),
      shufflesLeft: props.shufflesLeft,
      numberOfTilesToSpecial: props.L,
      busterShufflesLeft: 1,
      busterDynomiteLeft: 1,
      isDynamytingNow: false,
      turnExists: true,
      gameOver: { Win: false, Loose: false },
    };
  }
  makeFirstIterationBoardValid() {
    let newBoardArea = this.state.boardArea.map((el) => el.slice(0));
    let isFieldValid = gameLogic.isAnyTileCanBeBlasted(
      newBoardArea,
      this.state.aspectRatio.N,
      this.state.aspectRatio.M,
      this.state.minGroupBlast
    );
    while (!isFieldValid) {
      console.log("field was shuffled before game");
      gameLogic.shuffleTiles(
        newBoardArea,
        this.state.aspectRatio.N,
        this.state.aspectRatio.M,
        "preshuffle"
      );
      isFieldValid = gameLogic.isAnyTileCanBeBlasted(
        newBoardArea,
        this.state.aspectRatio.N,
        this.state.aspectRatio.M,
        this.state.minGroupBlast
      );
    }
    this.state.boardArea = newBoardArea;
  }

  countPoints(blastsCounter) {
    this.state.storedPoints += blastsCounter * 1.5;
  }

  shuffleButtonHandler() {
    this.state.boardArea = gameLogic.shuffleTiles(
      this.state.boardArea,
      this.state.aspectRatio.N,
      this.state.aspectRatio.M
    );
    this.state.busterShufflesLeft--;
  }

  dynomiteButtonHandler() {
    this.state.isDynamytingNow = true;
  }

  isGameEnded() {
    if (this.state.storedPoints >= this.state.neededPoints) {
      this.state.gameOver = { Win: true, Loose: false };
      //return true;
    }
    if (this.state.turnsAvailable === 0 || !this.state.turnExists) {
      this.state.gameOver = { Win: false, Loose: true };
      //return true;
    }
    // return false;
  }
  clickHandler(i, j) {
    const copyBoard = this.state.boardArea.map((el) => el.slice(0));
    console.log("clicked ", i, j, copyBoard);
    const blast = gameLogic.blastTile(
      copyBoard,
      i,
      j,
      this.state.aspectRatio.N,
      this.state.aspectRatio.M
    );
    if (blast.numberOfAvailiableBlasts >= this.state.minGroupBlast) {
      this.state.boardArea = blast.resultBoard;

      this.countPoints(blast.numberOfAvailiableBlasts);
      this.isGameEnded();
      this.state.turnsAvailable--;
      this.isGameEnded();

      let boardAreaAfterMove = copyBoard;
      if (blast.numberOfAvailiableBlasts > this.state.numberOfTilesToSpecial) {
        const boardAfterBigBlast = gameLogic.generateSpecialValue(
          blast.resultBoard,
          i,
          j
        );
        boardAreaAfterMove = gameLogic.moveAfterBlast(
          boardAfterBigBlast,
          this.state.aspectRatio.N,
          this.state.aspectRatio.M
        );
      } else {
        boardAreaAfterMove = gameLogic.moveAfterBlast(
          blast.resultBoard,
          this.state.aspectRatio.N,
          this.state.aspectRatio.M
        );
      }
      this.state.boardArea = boardAreaAfterMove;
      console.log(this.state.boardArea);
      this.updateAfterMove(boardAreaAfterMove);
    }
  }
}
export default Game;
