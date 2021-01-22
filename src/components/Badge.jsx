import React from "react";

function Badge({ color, className, onClick, id }) {
  const handleOnClick = () => {
    onClick(id);
  };
  return (
    <span
      className={className}
      onClick={handleOnClick}
      style={{ background: color }}></span>
  );
}

export default Badge;
