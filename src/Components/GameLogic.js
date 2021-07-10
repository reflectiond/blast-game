class GameLogic {
  createBoardArray(N, M, colorVar) {
    let newBoardArea = this.createArray(N, M);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        newBoardArea[i][j] = this.generateValue(1, colorVar);
      }
    }

    return newBoardArea;
  }
  createArray(length) {
    var arr = new Array(length || 0),
      i = length;

    if (arguments.length > 1) {
      var args = Array.prototype.slice.call(arguments, 1);
      while (i--) arr[length - 1 - i] = this.createArray.apply(this, args);
    }

    return arr;
  }
  generateValue(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  isValid(
    newX,
    newY,
    vis,
    N,
    M,
    oldX,
    oldY,
    boardArea,
    isSameValue,
    typeOfBFS,
    radius
  ) {
    if (newX < 0 || newX > N - 1 || newY < 0 || newY > M - 1) {
      return false;
    }
    if (radius === 0) {
      return false;
    }
    if (vis[newX][newY]) {
      return false;
    }
    if (typeOfBFS === "dynomite" || typeOfBFS === "special") {
      return true;
    }
    return isSameValue(boardArea[oldX][oldY], boardArea[newX][newY]);
  }
  isSameValue(currentTileValue, nextTileValue) {
    if (currentTileValue !== nextTileValue) {
      return false;
    }
    return true;
  }
  isAnyTileCanBeBlasted(boardArea, N, M, minGroupBlast) {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        let numberOfAvailiableBlasts = this.blastTile(
          boardArea,
          i,
          j,
          N,
          M,
        ).numberOfAvailiableBlasts;
        if (numberOfAvailiableBlasts >= minGroupBlast) {
          return true;
        }
      }
    }
    return false;
  }
  blastTile(boardArea, i, j, N, M, typeOfBFS = "casual", radius = 1) {
    let vis = this.createArray(N, M);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        vis[i][j] = false;
      }
    }
    let result = {
      resultBoard: boardArea.map((el) => el.slice(0)),
      numberOfAvailiableBlasts: 0,
    };
    let dx = [];
    let dy = [];
    //number of axis to check in BFS
    let n = 0;
    if (typeOfBFS === "casual" || typeOfBFS === "special") {
      dx = [-1, 0, 1, 0];
      dy = [0, 1, 0, -1];
      n = 4;
    } else if (typeOfBFS === "dynomite") {
      dx = [-1, 0, 1, 0, -1, -1, 1, 1];
      dy = [0, 1, 0, -1, -1, 1, -1, 1];
      n = 8;
    }

    //indices of the board tiles
    let q = [];
    //mark starting tile as visited
    //and push into queue
    q.push([i, j]);
    vis[i][j] = true;
    //iterate while q
    //isn't empty
    while (q.length !== 0) {
      let cell = q[0];
      let x = cell[0];
      let y = cell[1];
      q.shift();
      for (let k = 0; k < n; k++) {
        let newX = x + dx[k];
        let newY = y + dy[k];

        if (
          this.isValid(
            newX,
            newY,
            vis,
            N,
            M,
            x,
            y,
            boardArea,
            this.isSameValue,
            typeOfBFS,
            radius
          )
        ) {
          q.push([newX, newY]);
          vis[newX][newY] = true;
          result.resultBoard[newX][newY] = null;
          result.numberOfAvailiableBlasts++;
          if (result.resultBoard[x][y] !== null) {
            result.resultBoard[x][y] = null;
            result.numberOfAvailiableBlasts++;
          }
        }
      }
      if (typeOfBFS === "dynomite") {
          if (radius > 0){
              radius--;
          }
      }
    }
    return result;
  }
  generateSpecialValue(boardArea, i, j) {
    let tempBoardArea = boardArea.map((el) => el.slice(0));
    tempBoardArea[i][j] = "special";
    return tempBoardArea;
  }
  moveAfterBlast(boardArea, N, M) {
    let tempBoardArea = boardArea.map((el) => el.slice(0));
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        if (boardArea[i][j] === null && i !== 0) {
          for (let k = i; k > 0; k--) {
            tempBoardArea[k][j] = tempBoardArea[k - 1][j];
          }
          tempBoardArea[0][j] = null;
        }
      }
    }
    return tempBoardArea;
  }
  generateValuesAfterBlast(boardArea, N, M, colorVariaty) {
    let tempBoardArea = boardArea.map((el) => el.slice(0));
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        if (tempBoardArea[i][j] === null) {
          tempBoardArea[i][j] = this.generateValue(1, colorVariaty);
        }
      }
    }
    return tempBoardArea;
  }
}
module.exports = GameLogic;
