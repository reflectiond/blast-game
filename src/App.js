import './App.css';
import React from 'react';


let Y = 19;
let N = 10;
let M = 10;
let C = 5;
let minGroupBlast = 1;
let neededPoints = 100;
let shufflesAvailiable = 1;
let dynomiteRadius = 1;


function App() {
  function Tile(props){
    let bgColor = '';
    switch (props.value) {
      case 1:
        bgColor='green';
        break;
      case 2:
        bgColor='blue';
        break;
      case 3:
        bgColor='purple';
        break;
      case 4:
        bgColor='red';
        break;
      case 5:
        bgColor='yellow';
        break;
                
      default:
        break;
    }
    return (
      <div 
        style = {{
          backgroundImage: `url(assets/${bgColor}.png)`,

        }}
        className='tile' 
        onClick={() => props.clickHandler()}
      >
      </div>
    )
  }
  function GameOver(props){
    if (props.isGameOver.Loose){
      if (!props.isTurnExists){
        return(
          <div>
            Game Over! you lost (No available turns left)          
          </div>
        );
      }else if (props.isTurnLeft===0){
        return(
          <div>
            Game Over! you lost (No turns left)          
          </div>
        );
      }
    }else if(props.isGameOver.Win){
      return(
        <div>
          Game Over! you win         
        </div>
      );
    }
    return <div></div>;
  }
  function ShuffleButton(props){
      if (props.busterShufflesLeft > 0){
        return(
          <button
            className = 'busterButtons'
            onClick = {() => props.shuffleButtonHandler()}
          >Free Shuffle</button>
        )
      }else{
        return(
          <div></div>
        )
      }
  }
  function DynomiteButton(props){
    if (props.busterDynomiteLeft > 0){
      return(
        <button
          className = 'busterButtons'
          onClick = {() => props.dynomiteButtonHandler()}
        >Use Dynomite</button>
      )
    }else{
      return(
        <div></div>
      )
    }
}
  class BoardRow extends React.Component{

    renderTile(i, j){
      return(
        <Tile
          key = {i+j}
          value={this.props.boardArea[i][j]}
          clickHandler={()=>this.props.clickHandler(i, j)}
        />
      )
    }
    createBoardRow(numberOfrow){
      let rowToRender = [];
      for (let i = 0; i < this.props.numberOfTilesInRow; i++) {
        rowToRender.push(this.renderTile(numberOfrow, i));
      }
      return rowToRender;
    }
    render(){
      return(
        <div className="board-row">
          {this.createBoardRow(this.props.numberOfRow)}
        </div>
      )
    }
  }
  class Board extends React.Component{
    renderRow(i){
      return(
        <BoardRow
          key = {i}
          boardArea = {this.props.boardArea}
          numberOfTilesInRow = {this.props.aspectRatio.M}
          numberOfRow = {i}
          clickHandler={(i, j)=>this.props.clickHandler(i, j)}
        />
      )
    }
    createBoard(){
      let boardToRender = [];
      for (let i = 0; i < this.props.aspectRatio.N; i++) {
        boardToRender.push(this.renderRow(i));
      }
      return boardToRender;
    }


    render(){
      return(
        <div >
          {this.createBoard()}
        </div>
      )
    }
  }
  class Game extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        turnsAvailable : props.NumberOfTurns,
        aspectRatio : {N: props.aspectRatio.N, M: props.aspectRatio.M},
        colorVariaty: props.colorVariaty,
        minGroupBlast: props.minGroupBlast,
        storedPoints: 0,
        neededPoints: props.neededPoints,
        dynomiteRadius: props.dynomiteRadius,
        boardArea: this.createBoardArray(this.props.aspectRatio.N, this.props.aspectRatio.M, this.props.colorVariaty),
        shufflesLeft: props.shufflesLeft,
        busterShufflesLeft: 1,
        busterDynomiteLeft: 1,
        isDynamytingNow: false,
        turnExists: true,
        gameOver: {Win: false, Loose: false}
      }
      this.makeFirstIterationBoardValid();
    }
    createBoardArray(N, M, colorVar){
      let newBoardArea = this.createArray(N, M);
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
          newBoardArea[i][j] = this.generateValue(1, colorVar);
        }
      }

      return newBoardArea;
    }
    makeFirstIterationBoardValid(){
      let newBoardArea = this.state.boardArea.map(el => el.slice(0));
      while (!this.isAnyTileCanBeBlasted(newBoardArea)){
        console.log('field was shuffled before game')
        this.preShuffleTiles(newBoardArea);
        this.isAnyTileCanBeBlasted(newBoardArea);
      }
      this.setState({boardArea: newBoardArea})
    }

    createArray(length) {
      var arr = new Array(length || 0),
          i = length;
    
      if (arguments.length > 1) {
          var args = Array.prototype.slice.call(arguments, 1);
          while(i--) arr[length-1 - i] = this.createArray.apply(this, args);
      }
    
      return arr;
    }

    generateValue(min, max){
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    isValid(i, j, vis){
      if (i < 0 || i > this.state.aspectRatio.N - 1 || j < 0 || j > this.state.aspectRatio.M - 1) {
        return false;
      }
      if (vis[i][j]){
        return false;
      }

      return true;
    }
    
    isSameValue(currentTileValue, nextTileValue){
      if (currentTileValue!== nextTileValue){
        return false;
      }
      return true;
    }

    blastTile(boardArea, i, j){
      let vis = this.createArray(this.state.aspectRatio.N, this.state.aspectRatio.M);
      for (let i = 0; i < this.state.aspectRatio.N; i++) {
        for (let j = 0; j < this.state.aspectRatio.M; j++) {
          vis[i][j] = false;
        }
      }
      let result = {
        resultBoard: boardArea.map(el => el.slice(0)),
        numberOfAvailiableBlasts: 0
      };
      
      let dx = [-1, 0, 1, 0];
      let dy = [0, 1, 0, -1];
      //indices of the board tiles
      let q = [];
      //mark starting tile as visited 
      //and push into queue
      q.push([i, j]);
      vis[i][j] = true;
      //iterate while q
      //isn't empty
      while (q.length!==0){
        
        let cell = q[0];
        let x = cell[0];
        let y = cell[1];
        q.shift();
        for (let k = 0; k < 4; k++) {

          let newX = x + dx[k];
          let newY = y + dy[k];

          if (this.isValid(newX, newY, vis) && this.isSameValue(boardArea[x][y], boardArea[newX][newY])){
              q.push([newX, newY]);
              vis[newX][newY] = true;
              //mark all avaliable tiles to blast
              result.resultBoard[newX][newY] = null;
              result.numberOfAvailiableBlasts++;
              if(result.resultBoard[x][y]!== null){
                result.resultBoard[x][y] = null;
                result.numberOfAvailiableBlasts++;
              }
          }
        }
      }
      // console.log(result.resultBoard, 'number of blasts avail', result.numberOfAvailiableBlasts)
      return result;
    }
    dynomiteTile(boardArea, i, j){
      let vis = this.createArray(this.state.aspectRatio.N, this.state.aspectRatio.M);
      for (let i = 0; i < this.state.aspectRatio.N; i++) {
        for (let j = 0; j < this.state.aspectRatio.M; j++) {
          vis[i][j] = false;
        }
      }
      let result = {
        resultBoard: boardArea.map(el => el.slice(0)),
        numberOfAvailiableBlasts: 0
      };
      
      let radius = this.state.dynomiteRadius;
      let dx = [-1, 0, 1, 0, -1, -1,  1, 1];
      let dy = [0, 1, 0, -1, -1,  1, -1, 1];
      //indices of the board tiles
      let q = [];
      //mark starting tile as visited 
      //and push into queue
      q.push([i, j]);
      vis[i][j] = true;
      //iterate while q
      //isn't empty
      while (radius !== 0){
        
        let cell = q[0];
        let x = cell[0];
        let y = cell[1];
        q.shift();
        for (let k = 0; k < 8; k++) {

          let newX = x + dx[k];
          let newY = y + dy[k];

          if (this.isValid(newX, newY, vis)){
              q.push([newX, newY]);
              vis[newX][newY] = true;
              //mark all avaliable tiles to blast
              result.resultBoard[newX][newY] = null;
              result.numberOfAvailiableBlasts++;
              if(result.resultBoard[x][y]!== null){
                result.resultBoard[x][y] = null;
                result.numberOfAvailiableBlasts++;
              }
          }
        }
        radius--;
      }
      // console.log(result.resultBoard, 'number of blasts avail', result.numberOfAvailiableBlasts)
      return result;
    }

    isAnyTileCanBeBlasted(boardArea){
      for (let i = 0; i < this.state.aspectRatio.N; i++) {
        for (let j = 0; j < this.state.aspectRatio.M; j++) {
          let numberOfAvailiableBlasts = this.blastTile(boardArea, i, j).numberOfAvailiableBlasts;
          if(numberOfAvailiableBlasts >= this.state.minGroupBlast){
            return true;
          }
        }
      }
      return false;
    }

    moveAfterBlast(boardArea){
      let tempBoardArea = boardArea.map(el => el.slice(0));
      for (let i = 0; i < this.state.aspectRatio.N; i++) {
        for (let j = 0; j < this.state.aspectRatio.M; j++) {
          if (boardArea[i][j] === null && i!==0){
            for (let k = i; k > 0; k--) {
              tempBoardArea[k][j] = tempBoardArea[k-1][j];
            }
            tempBoardArea[0][j] = null;
          }
        }
      }
      return tempBoardArea;
    }

    countPoints(blastsCounter){
      this.setState({storedPoints: this.state.storedPoints + blastsCounter*1.5}, () => this.isGameEnded()); 
      
    }

    generateValuesAfterBlast(boardArea){
      let tempBoardArea = boardArea.map(el => el.slice(0));
      for (let i = 0; i < this.state.aspectRatio.N; i++) {
        for (let j = 0; j < this.state.aspectRatio.M; j++) {
          if (tempBoardArea[i][j]===null) {
            tempBoardArea[i][j] = this.generateValue(1, this.state.colorVariaty);
          }
        }
      }
        return tempBoardArea;
    }

    shuffleTiles(boardArea){
      let copyBoard = boardArea.map(el => el.slice(0));
      for (let i = 0; i < this.state.aspectRatio.N ; i++) {
        for (let j = 0; j < this.state.aspectRatio.M; j++) {
            let i1 = Math.floor(Math.random() * (this.state.aspectRatio.N));
            let j1 = Math.floor(Math.random() * (this.state.aspectRatio.M));

            let temp = copyBoard[i][j];
            copyBoard[i][j] = copyBoard[i1][j1];
            copyBoard[i1][j1] = temp;
        }
      }
      this.setState({shufflesLeft: this.state.shufflesLeft - 1})
      return copyBoard;
    }
    preShuffleTiles(boardArea){
      for (let i = 0; i < this.state.aspectRatio.N ; i++) {
        for (let j = 0; j < this.state.aspectRatio.M; j++) {
            let i1 = Math.floor(Math.random() * (this.state.aspectRatio.N));
            let j1 = Math.floor(Math.random() * (this.state.aspectRatio.M));

            let temp = boardArea[i][j];
            boardArea[i][j] = boardArea[i1][j1];
            boardArea[i1][j1] = temp;
        }
      }
    }
    busterShuffleTiles(boardArea){
      let copyBoard = boardArea.map(el => el.slice(0));
      for (let i = 0; i < this.state.aspectRatio.N ; i++) {
        for (let j = 0; j < this.state.aspectRatio.M; j++) {
            let i1 = Math.floor(Math.random() * (this.state.aspectRatio.N));
            let j1 = Math.floor(Math.random() * (this.state.aspectRatio.M));

            let temp = copyBoard[i][j];
            copyBoard[i][j] = copyBoard[i1][j1];
            copyBoard[i1][j1] = temp;
        }
      }
      this.setState({busterShufflesLeft: this.state.busterShufflesLeft - 1})
      return copyBoard;
    }

    shuffleButtonHandler(){
      this.setState({boardArea: (this.busterShuffleTiles(this.state.boardArea))})
    }

    dynomiteButtonHandler(){
      this.setState({isDynamytingNow: true});
    }

    isGameEnded(){
      if (this.state.storedPoints >= this.state.neededPoints) {
        this.setState({gameOver: {Win: true, Loose:false}});
      }
      if (this.state.turnsAvailable === 0 || !this.state.turnExists){
        this.setState({gameOver: {Win: false, Loose:true}});
      }
      
    }
    clickHandler(i, j){
      const copyBoard = this.state.boardArea.map(el => el.slice(0));
      const blast = this.blastTile(copyBoard, i, j)
      if (blast.numberOfAvailiableBlasts >= this.state.minGroupBlast){
        this.setState({boardArea: blast.resultBoard});
        
        this.countPoints(blast.numberOfAvailiableBlasts);
        this.setState({turnsAvailable: this.state.turnsAvailable -1 }, () => this.isGameEnded());
        

        const boardAreaAfterMove = this.moveAfterBlast(blast.resultBoard);
        this.setState({boardArea: boardAreaAfterMove});

        const boardAreaAfterReGenerate = this.generateValuesAfterBlast(boardAreaAfterMove);
        this.setState({boardArea: boardAreaAfterReGenerate});

        if(!this.isAnyTileCanBeBlasted(boardAreaAfterReGenerate)){
          if (this.state.shufflesLeft > 0){
            const boardAreaAfterShuffle = this.shuffleTiles(boardAreaAfterReGenerate);
            this.setState({boardArea: boardAreaAfterShuffle});
            if(!this.isAnyTileCanBeBlasted(boardAreaAfterShuffle)){
              this.setState({turnExists: false}, () => this.isGameEnded())
            }
          }else{
            this.setState({turnExists: false}, () => this.isGameEnded())
          }
        }
      }
    }
    dynomiteClickHandler(i, j){
      const copyBoard = this.state.boardArea.map(el => el.slice(0));
      // if (blastNumber >= this.state.minGroupBlast){
      const dynomite = this.dynomiteTile(copyBoard, i, j)
      
      this.setState({boardArea: dynomite.resultBoard});
      
      this.countPoints(dynomite.numberOfAvailiableBlasts * 0.5);
      this.setState({turnsAvailable: this.state.turnsAvailable -1 }, () => this.isGameEnded());

      const boardAreaAfterMove = this.moveAfterBlast(dynomite.resultBoard);
      this.setState({boardArea: boardAreaAfterMove});

      const boardAreaAfterReGenerate = this.generateValuesAfterBlast(boardAreaAfterMove);
      this.setState({boardArea: boardAreaAfterReGenerate});

      if(!this.isAnyTileCanBeBlasted(boardAreaAfterReGenerate)){
        if (this.state.shufflesLeft > 0){
          const boardAreaAfterShuffle = this.shuffleTiles(boardAreaAfterReGenerate);
          this.setState({boardArea: boardAreaAfterShuffle});
          if(!this.isAnyTileCanBeBlasted(boardAreaAfterShuffle)){
            this.setState({turnExists: false}, () => this.isGameEnded())
          }
        }else{
          this.setState({turnExists: false}, () => this.isGameEnded())
        }
      }
      this.setState({busterDynomiteLeft: this.state.busterDynomiteLeft - 1})
    }
    render(){
      if (this.state.gameOver.Loose === false && this.state.gameOver.Win === false){
        return(
          <div className="game">
            <div className="game-board" >
              <Board
                boardArea = {this.state.boardArea}
                aspectRatio = {this.state.aspectRatio}
                //generateValue = {() => this.GenerateValue(1, this.state.colorVariaty)}
                clickHandler = {this.state.isDynamytingNow ? (i, j) => this.dynomiteClickHandler(i, j) :(i, j) => this.clickHandler(i, j)}
              />
            </div>
            <div className="game-info">
              <div>StoredPoints: {this.state.storedPoints} / {this.state.neededPoints}</div>
              <ol>Turns left: {this.state.turnsAvailable}</ol>
              <ol>Shuffles left: {this.state.shufflesLeft}</ol>
              <ShuffleButton
                shuffleButtonHandler = {() => this.shuffleButtonHandler()}
                busterShufflesLeft = {this.state.busterShufflesLeft}
              />
              <DynomiteButton
                dynomiteButtonHandler = {() => this.dynomiteButtonHandler()}
                busterDynomiteLeft = {this.state.busterDynomiteLeft}
              />
            </div>
          </div>
        )
      }else{
        return(
          <GameOver
            isGameOver = {this.state.gameOver}
            isTurnExists = {this.state.turnExists}
            isTurnLeft = {this.state.turnsAvailable}
          />
        )
      }
    }
  }
  return (
    <div className="App">
      <Game
        NumberOfTurns = {Y}
        aspectRatio={{N :N, M :M}}
        colorVariaty={C}
        minGroupBlast={minGroupBlast}
        neededPoints={neededPoints}
        shufflesLeft={shufflesAvailiable}
        dynomiteRadius={dynomiteRadius}
      />
    </div>
  );
}

export default App;
