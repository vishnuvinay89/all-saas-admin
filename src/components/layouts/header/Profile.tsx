import CommonUserModal from "@/components/CommonUserModal";
import { FormContextType, Role } from "@/utils/app.constant";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FeatherIcon from "feather-icons-react";
import { useTranslation } from "next-i18next";
import React, { useEffect } from "react";

import { getFormRead } from "@/services/CreateUserService";
import { getUserDetailsInfo } from "@/services/UserList";
import { Storage } from "@/utils/app.constant";
import EditIcon from "@mui/icons-material/Edit";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import { Box, Button, IconButton, Menu, Typography } from "@mui/material";
import { useRouter } from "next/router";
import useSubmittedButtonStore from "@/utils/useSharedState";

const Profile = () => {
  const [anchorEl4, setAnchorEl4] = React.useState<null | HTMLElement>(null);
  const [profileClick, setProfileClick] = React.useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [userName, setUserName] = React.useState<string | null>("");
  const [userId, setUserId] = React.useState<string>("");
  const [adminInfo, setAdminInfo] = React.useState<any>();

  const [formdata, setFormData] = React.useState<any>();
  const adminInformation = useSubmittedButtonStore(
    (state: any) => state?.adminInformation
  );
  console.log(adminInformation);
  const [submitValue, setSubmitValue] = React.useState<boolean>(false);

  const [role, setRole] = React.useState<string | null>("");

  const [mobile, setMobile] = React.useState<string | null>("");
  const [initials, setInitials] = React.useState<string | null>("");

  const [email, setEmail] = React.useState<string | null>("");
  const { t } = useTranslation();
  const setAdminInformation = useSubmittedButtonStore(
    (state: any) => state.setAdminInformation
  );
  const router = useRouter();

  const handleClick4 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl4(event.currentTarget);
    setProfileClick(true);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("token");
    }
    router.push("/logout");
  };

  const mapFields = (formFields: any, response: any) => {
    let initialFormData: any = {};
    formFields.fields.forEach((item: any) => {
      const userData = response?.userData;
      const customFieldValue = userData?.customFields?.find(
        (field: any) => field.fieldId === item.fieldId
      );

      const getValue = (data: any, field: any) => {
        console.log(data, field);
        if (item.default) {
          return item.default;
        }
        if (item?.isMultiSelect) {
          if (data[item.name] && item?.maxSelections > 1) {
            return [field?.value];
          } else if (item?.type === "checkbox") {
            console.log(item);
            console.log(String(field?.value).split(","));

            return String(field?.value).split(",");
          } else {
            return field?.value?.toLowerCase();
          }
        } else {
          if (item?.type === "numeric") {
            return parseInt(String(field?.value));
          } else if (item?.type === "text") {
            return String(field?.value);
          } else {
            if (field?.value === "FEMALE" || field?.value === "MALE") {
              console.log(true);
              return field?.value?.toLowerCase();
            }
            //  console.log()
            return field?.value?.toLowerCase();
          }
        }
      };

      if (item.coreField) {
        if (item?.isMultiSelect) {
          if (userData[item.name] && item?.maxSelections > 1) {
            initialFormData[item.name] = [userData[item.name]];
          } else if (item?.type === "checkbox") {
            // console.log("checkbox")

            initialFormData[item.name] = String(userData[item.name]).split(",");
          } else {
            initialFormData[item.name] = userData[item.name];
          }
        } else if (item?.type === "numeric") {
          console.log(item?.name);
          initialFormData[item.name] = Number(userData[item.name]);
        } else if (item?.type === "text" && userData[item.name]) {
          initialFormData[item.name] = String(userData[item.name]);
        } else {
          console.log(item.name);
          if (userData[item.name]) {
            initialFormData[item.name] = userData[item.name];
          }
        }
      } else {
        const fieldValue = getValue(userData, customFieldValue);

        if (fieldValue) {
          initialFormData[item.name] = fieldValue;
        }
      }
    });

    console.log("initialFormData", initialFormData);
    return initialFormData;
  };
  const handleEditClick = async (rowData: any) => {
    handleClose4();
    if (submitValue) {
      setSubmitValue(false);
    }
    console.log("Edit row:", rowData);

    try {
      const fieldValue = true;
      const response = await getUserDetailsInfo(
        adminInformation?.userId,
        fieldValue
      );
      // console.log(role);

      let formFields;
      if (Role.STUDENT === adminInformation?.role) {
        formFields = await getFormRead("USERS", "STUDENT");
        setFormData(mapFields(formFields, response));
        console.log("mapped formdata", formdata);
      } else if (Role.TEACHER === adminInformation?.role) {
        console.log("mapped formdata", formdata);

        formFields = await getFormRead("USERS", "TEACHER");
        setFormData(mapFields(formFields, response));
      } else if (Role.TEAM_LEADER === adminInformation?.role) {
        formFields = await getFormRead("USERS", "TEAM LEADER");
        setFormData(mapFields(formFields, response));
      } else {
        formFields = await getFormRead("USERS", "ADMIN");
        setFormData(mapFields(formFields, response));
      }
      handleOpenEditModal();

      console.log("response", response);
      console.log("formFields", formFields);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserName = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      const name = localStorage.getItem(Storage.NAME);
      setUserName(name);
    }
  };
  const handleCloseAddLearnerModal = () => {
    setOpenEditModal(false);
  };
  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };
  useEffect(() => {
    getUserName();
  }, [formdata]);
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const admin = localStorage.getItem("adminInfo");
      if (admin) setAdminInfo(JSON.parse(admin));
    }
  }, []);

  const handleModalSubmit = (value: boolean) => {
    submitValue ? setSubmitValue(false) : setSubmitValue(true);
  };
  const userType = (() => {
    switch (adminInfo?.role) {
      case Role.STUDENT:
        return FormContextType.STUDENT;
      case Role.TEACHER:
        return FormContextType.TEACHER;
      case Role.ADMIN:
        return FormContextType.ADMIN;
      default:
        return FormContextType.TEAM_LEADER;
    }
  })();

  return (
    <>
      <Button
        aria-label="menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick4}
        sx={{ border: "none" }}
      >
        <Box display="flex" alignItems="center" color="white">
          <AccountCircleIcon />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 1,
            }}
          >
            <Typography
              variant="body1"
              fontWeight="400"
              sx={{ fontSize: "16px" }}
            >
              {t("COMMON.HI")}
            </Typography>
            <Typography
              variant="body1"
              fontWeight="400"
              sx={{
                ml: 1,
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "16px",
                whiteSpace: "nowrap",
              }}
            >
              {userName
                ? userName
                    .split(" ")
                    .map(
                      (name) =>
                        name.charAt(0).toUpperCase() +
                        name.slice(1).toLowerCase()
                    )
                    .join(" ")
                : ""}
            </Typography>
            <FeatherIcon icon="chevron-down" size="20" />
          </Box>
        </Box>
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl4}
        keepMounted
        open={Boolean(anchorEl4)}
        onClose={handleClose4}
        PaperProps={{
          sx: {
            width: "500px",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <IconButton
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
            onClick={handleEditClick}
          >
            <EditIcon />
          </IconButton> */}

          <Box
            sx={{
              backgroundColor: "#FFC107",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", fontSize: "18px" }}
            >
              {adminInfo?.name
                ?.split(" ")
                .map((word: any) => word[0])
                .join("")}
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ marginBottom: "10px" }}>
            {adminInfo?.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: "20px" }}>
            {adminInfo?.role}
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
          >
            <PhoneIcon sx={{ marginRight: "10px" }} />
            <Typography variant="body1">{adminInfo?.mobile}</Typography>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
          >
            <MailIcon sx={{ marginRight: "10px" }} />
            <Typography variant="body1">{adminInfo?.email}</Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ fontSize: "16px" }}
          >
            {t("COMMON.LOGOUT")}
          </Button>
        </Box>
      </Menu>
      {console.log(adminInfo?.role)}
      {openEditModal && (
        <CommonUserModal
          open={openEditModal}
          onClose={handleCloseAddLearnerModal}
          formData={formdata}
          isEditModal={true}
          userId={userId}
          onSubmit={handleModalSubmit}
          userType={userType}
        />
      )}
    </>
  );
};

export default Profile;
