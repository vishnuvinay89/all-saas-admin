import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { firstLetterInUpperCase, getUserName } from "./../utils/Helper";

const UserNameCell = ({ userId }: { userId: string }) => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const id = userId;
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

  return (
    <div>
      {userName ? firstLetterInUpperCase(userName) : <Typography>-</Typography>}
    </div>
  );
};

export default UserNameCell;
