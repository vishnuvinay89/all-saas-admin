import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { firstLetterInUpperCase, getUserName } from "./../utils/Helper";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/utils/app.constant";
import { getUserDetailsInfo } from "@/services/UserList";

const UserNameCell = ({ userId }: { userId: string }) => {
  console.log(userId);
  const [userName, setUserName] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getUserName = async (userId: string) => {
      try {
        const userDetails = await queryClient.fetchQuery({
          queryKey: [QueryKeys.USER_READ, userId],
          queryFn: () => getUserDetailsInfo(userId, false),
        });

        const name = userDetails?.userData?.name;
        setUserName(name);
      } catch (error) {
        console.error("Error in fetching user name:", error);
      }
    };

    getUserName(userId);
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
