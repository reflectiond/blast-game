import React from "react";
import BoardRow from "./BoardRow";

class Board extends React.Component {
  renderRow(i) {
    return (
      <BoardRow
        key={i}
        boardArea={this.props.boardArea}
        numberOfTilesInRow={this.props.aspectRatio.M}
        numberOfRow={i}
        clickHandler={(i, j) => this.props.clickHandler(i, j)}
        specialClickHandler={(i, j) => this.props.specialClickHandler(i, j)}
      />
    );
  }
  createBoard() {
    let boardToRender = [];
    for (let i = 0; i < this.props.aspectRatio.N; i++) {
      boardToRender.push(this.renderRow(i));
    }
    return boardToRender;
  }

  render() {
    return <div>{this.createBoard()}</div>;
  }
}
export default Board;
