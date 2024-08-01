import { firtstLetterInUpperCase, getUserName } from "./../utils/Helper";
import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
// import { getUserName } from "../path/to/helper";

const UserNameCell = ({ userId }: { userId: string }) => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const id = userId;
      const fieldValue = true;
      const name = await getUserName(id);
      setUserName(name);
    };

    fetchUserName();
  }, [userId]);

  if (userName === null) {
    return (
      <div>
        <Box sx={{ display: "flex" }}>
          <CircularProgress
            color="inherit"
            size={20}
            thickness={4}
            value={100}
          />
        </Box>
      </div>
    );
  }

  return <div>{firtstLetterInUpperCase(userName)}</div>;
};

export default UserNameCell;
