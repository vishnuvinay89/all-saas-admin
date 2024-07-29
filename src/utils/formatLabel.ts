import React from "react";

const formatLabel = (label: string) => {
  return label
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default formatLabel;
