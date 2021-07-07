import React from 'react';
import Tile from './Tile.js'

class BoardRow extends React.Component {
  renderTile(i, j) {
    return (
      <Tile
        key={i + j}
        value={this.props.boardArea[i][j]}
        clickHandler={() => this.props.clickHandler(i, j)}
        specialClickHandler={() => this.props.specialClickHandler(i, j)}
      />
    );
  }
  createBoardRow(numberOfrow) {
    let rowToRender = [];
    for (let i = 0; i < this.props.numberOfTilesInRow; i++) {
      rowToRender.push(this.renderTile(numberOfrow, i));
    }
    return rowToRender;
  }
  render() {
    return (
      <div className="board-row">
        {this.createBoardRow(this.props.numberOfRow)}
      </div>
    );
  }
}
export default BoardRow;