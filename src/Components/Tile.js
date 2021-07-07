import React from "react";

function Tile(props) {
  let bgColor = "";
  switch (props.value) {
    case 1:
      bgColor = "green";
      break;
    case 2:
      bgColor = "blue";
      break;
    case 3:
      bgColor = "purple";
      break;
    case 4:
      bgColor = "red";
      break;
    case 5:
      bgColor = "yellow";
      break;
    case "special":
      bgColor = "special";
      break;
    default:
      break;
  }
  if (bgColor === "special") {
    return (
      <div
        style={{
          backgroundImage: `url(assets/${bgColor}.png)`,
        }}
        className="tile"
        onClick={() => props.specialClickHandler()}
      ></div>
    );
  }
  return (
    <div
      style={{
        backgroundImage: `url(assets/${bgColor}.png)`,
      }}
      className="tile"
      onClick={() => props.clickHandler()}
    ></div>
  );
}
export default Tile;
