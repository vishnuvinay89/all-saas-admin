import React from "react";
import { Link } from "@mui/material";
import Image from "next/image";
import LogoDark from "../../../../public/logo-saas.png";

const LogoIcon = () => {
  return (
    <>
      <Image src={LogoDark} alt={"LogoDark"}  />
    </>
  );
};

export default LogoIcon;
