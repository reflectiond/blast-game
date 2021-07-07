import React from "react";

function ShuffleButton(props) {
  if (props.busterShufflesLeft > 0) {
    return (
      <button
        className="busterButtons"
        onClick={() => props.shuffleButtonHandler()}
      >
        Free Shuffle
      </button>
    );
  } else {
    return <div></div>;
  }
}
export default ShuffleButton;
