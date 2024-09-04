import {
  Box,
  Checkbox,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { showToastMessage } from "./Toastify";
import CustomModal from "./CustomModal";
import SearchIcon from "@mui/icons-material/Search";
import { Role } from "@/utils/app.constant";
import { bulkCreateCohortMembers } from "@/services/CohortService/cohortService";
import { getCenterList } from "@/services/MasterDataService";
import { getUserDetailsInfo } from "@/services/UserList";
import { updateUser } from "@/services/CreateUserService";

interface ReassignCohortModalProps {
  open: boolean;
  onClose: () => void;
  cohortData?: any;
  userId?: string;
  userType?: string;
  blocks?: any;
  blockName?: any;
  previousCenters?: any;
  fetchUserList: () => void;
}

interface Cohort {
  id: any;
  cohortId: string;
  name: string;
}

const ReassignCenterModal: React.FC<ReassignCohortModalProps> = ({
  open,
  onClose,
  cohortData,
  userId,
  userType,
  blocks,
  blockName,
  previousCenters,
  fetchUserList,
}) => {
  console.log(blocks);
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const cohorts: Cohort[] = cohortData?.map(
    (cohort: { cohortId: any; name: string }) => ({
      name: cohort.name,
      id: cohort.cohortId,
    })
  );

  const [searchInput, setSearchInput] = useState("");
  const [selectedBlockId, setselectedBlockId] = useState("");

  const [checkedCenters, setCheckedCenters] = useState<string[]>([]);

  useEffect(() => {
    setCheckedCenters(previousCenters);
  }, [previousCenters]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value.toLowerCase());
  };

  const handleClose = () => {
    setCheckedCenters([]);
    onClose();
  };

  const handleToggle = (name: string) => {
    setCheckedCenters((prev) =>
      prev.includes(name)
        ? prev.filter((center) => center !== name)
        : [...prev, name]
    );
  };

  const handleReassign = async () => {
    try {
      const selectedData = cohorts
        .filter((center) => checkedCenters.includes(center.name))
        .map((center) => center.id);
      const unSelectedData = cohorts
        .filter((center) => !checkedCenters.includes(center.name))
        .map((center) => center.id);

      let payload;

      if (userType !== Role.TEAM_LEADERS) {
        payload = {
          userId: [userId],
          cohortId: selectedData,
          removeCohortId: unSelectedData,
        };

        await bulkCreateCohortMembers(payload);

        showToastMessage(
          t(
            userType === Role.TEAM_LEADERS
              ? "COMMON.BLOCKS_REASSIGN_SUCCESSFULLY"
              : "COMMON.CENTERS_REASSIGN_SUCCESSFULLY"
          ),
          "success"
        );
      } else {
        const reassignBlockObject = {
          limit: 200,
          offset: 0,
          filters: {
            status: ["active"],
            name: checkedCenters[0],
          },
        };

        const response = await getCenterList(reassignBlockObject);
        const cohortDetails = response?.result?.results?.cohortDetails;
        const selectedBlockCohortId = cohortDetails?.find(
          (item: any) => item?.type === "BLOCK"
        )?.cohortId;

        if (!selectedBlockCohortId) {
          showToastMessage(
            t("COMMON.COHORT_ID_NOT_FOUND", { block: checkedCenters[0] }),
            "info"
          );
          return;
        }

        const previousBlockObject = {
          limit: 200,
          offset: 0,
          filters: {
            status: ["active"],
            name: blockName,
          },
        };

        const previousResponse = await getCenterList(previousBlockObject);
        const previousCohortDetails =
          previousResponse?.result?.results?.cohortDetails;
        const previousBlockId = previousCohortDetails?.find(
          (item: any) => item?.type === "BLOCK"
        )?.cohortId;

        payload = {
          userId: [userId],
          cohortId: [selectedBlockCohortId],
          removeCohortId: [previousBlockId],
        };

        await bulkCreateCohortMembers(payload);
        handleClose();

        const userDetails = await getUserDetailsInfo(userId);
        const blockField = userDetails?.userData?.customFields.find(
          (field: any) => field.label === "BLOCKS"
        );

        const customFields = [
          {
            fieldId: blockField.fieldId,
            value: checkedCenters[0],
          },
        ];

        const updateObject = {
          userData: {},
          customFields: customFields,
        };

        if (userId) {
          await updateUser(userId, updateObject);
        }

        showToastMessage(t("COMMON.BLOCKS_REASSIGN_SUCCESSFULLY"), "success");
      }
    } catch (error) {
      showToastMessage(
        t(
          userType === Role.TEAM_LEADERS
            ? "COMMON.BLOCKS_REASSIGN_FAILED"
            : "COMMON.CENTERS_REASSIGN_FAILED"
        ),
        "error"
      );
    } finally {
      handleClose();
      fetchUserList();
      // window.location.reload();
    }
  };

  const filteredCohorts = cohorts?.filter((cohort) =>
    cohort.name.toLowerCase().includes(searchInput)
  );

  // const filteredCBlocks = blocks?.filter((cohort: any) =>
  //   cohort.label.toLowerCase().includes(searchInput)
  // );
  const filteredCBlocks = blocks
    ?.filter((cohort: any) => cohort.label.toLowerCase().includes(searchInput))
    .map((cohort: any) => ({
      label: cohort.label,
      value: cohort.value,
    }));

  const handleToggle2 = (centerName: string) => {
    // If the selected center is already checked, uncheck it
    if (checkedCenters.includes(centerName)) {
      setCheckedCenters([]);
    } else {
      // Otherwise, clear any previous selection and check the new one
      setCheckedCenters([centerName]);
    }
  };

  return (
    <CustomModal
      open={open}
      handleClose={handleClose}
      title={
        userType === Role.TEAM_LEADERS
          ? t("COMMON.REASSIGN_BLOCKS")
          : t("COMMON.REASSIGN_CLASSES")
      }
      primaryBtnText={t("COMMON.REASSIGN")}
      primaryBtnClick={handleReassign}
      primaryBtnDisabled={checkedCenters.length === 0}
    >
      <Box sx={{ p: 1 }}>
        <TextField
          sx={{
            backgroundColor: theme.palette.warning["A700"],
            borderRadius: 8,
            "& .MuiOutlinedInput-root fieldset": { border: "none" },
            "& .MuiOutlinedInput-input": { borderRadius: 8 },
          }}
          placeholder={
            userType === Role.TEAM_LEADERS
              ? t("MASTER.SEARCHBAR_PLACEHOLDER_BLOCK")
              : t("CENTERS.SEARCHBAR_PLACEHOLDER")
          }
          value={searchInput}
          onChange={handleSearchInputChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box sx={{ p: 3, maxHeight: "300px", overflowY: "auto" }}>
        {userType !== Role.TEAM_LEADERS
          ? filteredCohorts?.map((center) => (
              <Box key={center.id}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <span style={{ color: "black" }}>{center.name}</span>
                  <Checkbox
                    checked={checkedCenters.includes(center.name)}
                    onChange={() => handleToggle(center.name)}
                    sx={{
                      color: theme.palette.text.primary,
                      "&.Mui-checked": {
                        color: "black",
                      },
                      verticalAlign: "middle",
                      marginTop: "-10px",
                    }}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Box>
            ))
          : filteredCBlocks?.map((center: any) => (
              <Box key={center.value}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <span style={{ color: "black" }}>{center.label}</span>
                  <Checkbox
                    checked={checkedCenters.includes(center.value)}
                    onChange={() => handleToggle2(center.value)}
                    sx={{
                      color: theme.palette.text.primary,
                      "&.Mui-checked": {
                        color: "black",
                      },
                      verticalAlign: "middle",
                      marginTop: "-10px",
                    }}
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Box>
            ))}
      </Box>
    </CustomModal>
  );
};

export default ReassignCenterModal;
