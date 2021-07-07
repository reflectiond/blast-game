import React from "react";

function DynomiteButton(props) {
  if (props.busterDynomiteLeft > 0) {
    return (
      <button
        className="busterButtons"
        onClick={() => props.dynomiteButtonHandler()}
      >
        Use Dynomite
      </button>
    );
  } else {
    return <div></div>;
  }
}
export default DynomiteButton;
