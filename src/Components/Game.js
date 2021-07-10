import React from "react";
import Board from "./Board";
import GameOver from "./GameOver";
import DynomiteButton from "./DynomiteButton";
import ShuffleButton from "./ShuffleButton";
const GameLogic = require('./GameLogic');
let gameLogic = new GameLogic();
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      turnsAvailable: props.NumberOfTurns,
      aspectRatio: { N: props.aspectRatio.N, M: props.aspectRatio.M },
      colorVariaty: props.colorVariaty,
      minGroupBlast: props.minGroupBlast,
      storedPoints: 0,
      neededPoints: props.neededPoints,
      dynomiteRadius: props.dynomiteRadius,
      boardArea: gameLogic.createBoardArray(
        this.props.aspectRatio.N,
        this.props.aspectRatio.M,
        this.props.colorVariaty
      ),
      shufflesLeft: props.shufflesLeft,
      numberOfTilesToSpecial: props.L,
      busterShufflesLeft: 1,
      busterDynomiteLeft: 1,
      isDynamytingNow: false,
      turnExists: true,
      gameOver: { Win: false, Loose: false },
    };
    // this.makeFirstIterationBoardValid();
  }

  // makeFirstIterationBoardValid() {
  //   let newBoardArea = this.state.boardArea.map((el) => el.slice(0));
  //   while (!this.isAnyTileCanBeBlasted(newBoardArea)) {
  //     console.log("field was shuffled before game");
  //     this.preShuffleTiles(newBoardArea);
  //     this.isAnyTileCanBeBlasted(newBoardArea);
  //   }
  //   this.setState({ boardArea: newBoardArea });
  // }
  



  countPoints(blastsCounter) {
    this.setState(
      { storedPoints: this.state.storedPoints + blastsCounter * 1.5 },
      () => this.isGameEnded()
    );
  }




  shuffleTiles(boardArea) {
    let copyBoard = boardArea.map((el) => el.slice(0));
    for (let i = 0; i < this.state.aspectRatio.N; i++) {
      for (let j = 0; j < this.state.aspectRatio.M; j++) {
        let i1 = Math.floor(Math.random() * this.state.aspectRatio.N);
        let j1 = Math.floor(Math.random() * this.state.aspectRatio.M);

        let temp = copyBoard[i][j];
        copyBoard[i][j] = copyBoard[i1][j1];
        copyBoard[i1][j1] = temp;
      }
    }
    this.setState({ shufflesLeft: this.state.shufflesLeft - 1 });
    return copyBoard;
  }
  preShuffleTiles(boardArea) {
    for (let i = 0; i < this.state.aspectRatio.N; i++) {
      for (let j = 0; j < this.state.aspectRatio.M; j++) {
        let i1 = Math.floor(Math.random() * this.state.aspectRatio.N);
        let j1 = Math.floor(Math.random() * this.state.aspectRatio.M);

        let temp = boardArea[i][j];
        boardArea[i][j] = boardArea[i1][j1];
        boardArea[i1][j1] = temp;
      }
    }
  }
  busterShuffleTiles(boardArea) {
    let copyBoard = boardArea.map((el) => el.slice(0));
    for (let i = 0; i < this.state.aspectRatio.N; i++) {
      for (let j = 0; j < this.state.aspectRatio.M; j++) {
        let i1 = Math.floor(Math.random() * this.state.aspectRatio.N);
        let j1 = Math.floor(Math.random() * this.state.aspectRatio.M);

        let temp = copyBoard[i][j];
        copyBoard[i][j] = copyBoard[i1][j1];
        copyBoard[i1][j1] = temp;
      }
    }
    this.setState({ busterShufflesLeft: this.state.busterShufflesLeft - 1 });
    return copyBoard;
  }

  shuffleButtonHandler() {
    this.setState({ boardArea: this.busterShuffleTiles(this.state.boardArea) });
  }

  dynomiteButtonHandler() {
    this.setState({ isDynamytingNow: true });
  }

  isGameEnded() {
    if (this.state.storedPoints >= this.state.neededPoints) {
      this.setState({ gameOver: { Win: true, Loose: false } });
    }
    if (this.state.turnsAvailable === 0 || !this.state.turnExists) {
      this.setState({ gameOver: { Win: false, Loose: true } });
    }
  }
  clickHandler(i, j) {
    const copyBoard = this.state.boardArea.map((el) => el.slice(0));
    const blast = gameLogic.blastTile(copyBoard, i, j, this.state.aspectRatio.N, this.state.aspectRatio.M);
    console.log(blast);
    if (blast.numberOfAvailiableBlasts >= this.state.minGroupBlast) {
      this.setState({ boardArea: blast.resultBoard });

      this.countPoints(blast.numberOfAvailiableBlasts);
      this.setState({ turnsAvailable: this.state.turnsAvailable - 1 }, () =>
        this.isGameEnded()
      );

      let boardAreaAfterMove = copyBoard;
      if (blast.numberOfAvailiableBlasts > this.state.numberOfTilesToSpecial) {
        const boardAfterBigBlast = gameLogic.generateSpecialValue(
          blast.resultBoard,
          i,
          j
        );
        boardAreaAfterMove = gameLogic.moveAfterBlast(boardAfterBigBlast, this.state.aspectRatio.N, this.state.aspectRatio.M);
      } else {
        boardAreaAfterMove = gameLogic.moveAfterBlast(blast.resultBoard, this.state.aspectRatio.N, this.state.aspectRatio.M);
      }
      this.setState({ boardArea: boardAreaAfterMove });

      this.updateAfterMove(boardAreaAfterMove);
    }
  }
  specialClickHandler(i, j) {
    const copyBoard = this.state.boardArea.map((el) => el.slice(0));
    const blast = gameLogic.blastTile(copyBoard, i, j, this.state.aspectRatio.N, this.state.aspectRatio.M, 'special');
    this.setState({ boardArea: blast.resultBoard });

    this.countPoints(4);
    this.setState({ turnsAvailable: this.state.turnsAvailable - 1 }, () =>
      this.isGameEnded()
    );

    const boardAreaAfterMove = this.moveAfterBlast(blast.resultBoard);
    this.setState({ boardArea: boardAreaAfterMove });

    this.updateAfterMove(boardAreaAfterMove);
  }
  dynomiteClickHandler(i, j) {
    const copyBoard = this.state.boardArea.map((el) => el.slice(0));
    // if (blastNumber >= this.state.minGroupBlast){
    const dynomite = gameLogic.blastTile(copyBoard, i, j, this.state.aspectRatio.N, this.state.aspectRatio.M, 'dynomite', this.state.dynomiteRadius);

    this.setState({ boardArea: dynomite.resultBoard });

    this.countPoints(dynomite.numberOfAvailiableBlasts * 0.5);
    this.setState({ turnsAvailable: this.state.turnsAvailable - 1 }, () =>
      this.isGameEnded()
    );

    // const boardAreaAfterMove = this.moveAfterBlast(dynomite.resultBoard);
    // this.setState({ boardArea: boardAreaAfterMove });

    // this.updateAfterMove(boardAreaAfterMove);

    // this.setState({ busterDynomiteLeft: this.state.busterDynomiteLeft - 1 });
  }
  updateAfterMove(boardAreaAfterMove) {
    const boardAreaAfterReGenerate =
      gameLogic.generateValuesAfterBlast(boardAreaAfterMove, this.state.aspectRatio.N, this.state.aspectRatio.M, this.state.colorVariaty);
    this.setState({ boardArea: boardAreaAfterReGenerate });

    if (!gameLogic.isAnyTileCanBeBlasted(boardAreaAfterReGenerate, this.state.aspectRatio.N, this.state.aspectRatio.M, this.state.minGroupBlast)) {
      if (this.state.shufflesLeft > 0) {
        const boardAreaAfterShuffle = this.shuffleTiles(
          boardAreaAfterReGenerate
        );
        this.setState({ boardArea: boardAreaAfterShuffle });
        if (!this.isAnyTileCanBeBlasted(boardAreaAfterShuffle)) {
          this.setState({ turnExists: false }, () => this.isGameEnded());
        }
      } else {
        this.setState({ turnExists: false }, () => this.isGameEnded());
      }
    }
  }
  render() {
    if (
      this.state.gameOver.Loose === false &&
      this.state.gameOver.Win === false
    ) {
      return (
        <div className="game">
          <div className="game-board">
            <Board
              boardArea={this.state.boardArea}
              aspectRatio={this.state.aspectRatio}
              //generateValue = {() => this.GenerateValue(1, this.state.colorVariaty)}
              clickHandler={
                this.state.isDynamytingNow
                  ? (i, j) => this.dynomiteClickHandler(i, j)
                  : (i, j) => this.clickHandler(i, j)
              }
              specialClickHandler={(i, j) => this.specialClickHandler(i, j)}
            />
          </div>
          <div className="game-info">
            <div>
              StoredPoints: {this.state.storedPoints} /{" "}
              {this.state.neededPoints}
            </div>
            <ol>Turns left: {this.state.turnsAvailable}</ol>
            <ol>Shuffles left: {this.state.shufflesLeft}</ol>
            <ShuffleButton
              shuffleButtonHandler={() => this.shuffleButtonHandler()}
              busterShufflesLeft={this.state.busterShufflesLeft}
            />
            <DynomiteButton
              dynomiteButtonHandler={() => this.dynomiteButtonHandler()}
              busterDynomiteLeft={this.state.busterDynomiteLeft}
            />
          </div>
        </div>
      );
    } else {
      return (
        <GameOver
          isGameOver={this.state.gameOver}
          isTurnExists={this.state.turnExists}
          isTurnLeft={this.state.turnsAvailable}
        />
      );
    }
  }
}
export default Game;
