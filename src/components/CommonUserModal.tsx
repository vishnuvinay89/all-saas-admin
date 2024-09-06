import DynamicForm from "@/components/DynamicForm";
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from "@/components/GeneratedSchemas";
import SimpleModal from "@/components/SimpleModal";
import {
  createUser,
  getFormRead,
  updateUser,
} from "@/services/CreateUserService";
import { generateUsernameAndPassword } from "@/utils/Helper";
import { FormData } from "@/utils/Interfaces";
import {
  FormContext,
  FormContextType,
  RoleId,
  Role,
  apiCatchingDuration,
  passwordKeys,
} from "@/utils/app.constant";
import { useLocationState } from "@/utils/useLocationState";
import useSubmittedButtonStore from "@/utils/useSharedState";
import { Box, Button, useTheme } from "@mui/material";
import { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { addCustomCredentional, tenantId } from "../../app.config";
import { transformArray } from "../utils/Helper";
import AreaSelection from "./AreaSelection";
import { showToastMessage } from "./Toastify";
import SendCredentialModal from "./SendCredentialModal";
import { sendCredentialService } from "@/services/NotificationService";
import { useQuery } from "@tanstack/react-query";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  formData?: object;
  isEditModal?: boolean;
  userId?: string;
  onSubmit: (submitValue: boolean) => void;
  userType: string;
}

const CommonUserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  formData,
  isEditModal = false,
  userId,
  onSubmit,
  userType,
}) => {
  console.log(userType);
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [openModal, setOpenModal] = React.useState(false);
  const [adminInfo, setAdminInfo] = React.useState<any>();
  const messageKeyMap: Record<string, string> = {
    [FormContextType.STUDENT]: "LEARNERS.LEARNER_CREATED_SUCCESSFULLY",
    [FormContextType.TEACHER]: "FACILITATORS.FACILITATOR_CREATED_SUCCESSFULLY",
    [FormContextType.TEAM_LEADER]:
      "TEAM_LEADERS.TEAM_LEADER_CREATED_SUCCESSFULLY",
    [FormContextType.ADMIN]: "ADMIN.ADMIN_UPDATED_SUCCESSFULLY",
  };
  const delayCredentialsMessageMap: Record<string, string> = {
    [FormContextType.STUDENT]: "LEARNERS.USER_CREDENTIALS_WILL_BE_SEND_SOON",
    [FormContextType.TEACHER]:
      "FACILITATORS.USER_CREDENTIALS_WILL_BE_SEND_SOON",
    [FormContextType.TEAM_LEADER]:
      "TEAM_LEADERS.USER_CREDENTIALS_WILL_BE_SEND_SOON",
  };
  const [submitButtonEnable, setSubmitButtonEnable] =
    React.useState<boolean>(false);
  const roleType = userType;
  const { t } = useTranslation();
  const [formValue, setFormValue] = useState<any>();
  const adminInformation = useSubmittedButtonStore(
    (state: any) => state?.adminInformation
  );
  const submittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.submittedButtonStatus
  );
  const [createFacilitator, setCreateFacilitator] = React.useState(false);
  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );
  const noError = useSubmittedButtonStore((state: any) => state.noError);

  const userEnteredEmail = useSubmittedButtonStore(
    (state: any) => state.userEnteredEmail
  );
  const {
    data: teacherFormData,
    isLoading: teacherFormDataLoading,
    error: teacherFormDataErrror,
  } = useQuery<any>({
    queryKey: ["teacherFormData"],
    queryFn: () => getFormRead(FormContext.USERS, FormContextType.TEACHER),
    staleTime: apiCatchingDuration.GETREADFORM,
  });
  const {
    data: studentFormData,
    isLoading: studentFormDataLoading,
    error: studentFormDataErrror,
  } = useQuery<any>({
    queryKey: ["studentFormData"],
    queryFn: () => getFormRead(FormContext.USERS, FormContextType.STUDENT),
    staleTime: apiCatchingDuration.GETREADFORM,
  });
  const {
    data: teamLeaderFormData,
    isLoading: teamLeaderFormDataLoading,
    error: teamLeaderFormDataErrror,
  } = useQuery<any>({
    queryKey: ["teamLeaderFormData"],
    queryFn: () => getFormRead(FormContext.USERS, FormContextType.TEAM_LEADER),
    staleTime: apiCatchingDuration.GETREADFORM,
  });
  // const { data:adminFormData ,isLoading: adminFormDataLoading, error :adminFormDataErrror} = useQuery<FormData>({
  //   queryKey: ["adminFormData"],
  //   queryFn: () => getFormRead(
  //     FormContext.USERS,
  //     FormContextType.ADMIN
  //     ),
  //   staleTime: apiCatchingDuration.GETREADFORM,
  // })
  const modalTitle = !isEditModal
    ? userType === FormContextType.STUDENT
      ? t("LEARNERS.NEW_LEARNER")
      : userType === FormContextType.TEACHER
        ? t("FACILITATORS.NEW_FACILITATOR")
        : t("TEAM_LEADERS.NEW_TEAM_LEADER")
    : userType === FormContextType.STUDENT
      ? t("LEARNERS.EDIT_LEARNER")
      : userType === FormContextType.TEACHER
        ? t("FACILITATORS.EDIT_FACILITATOR")
        : t("TEAM_LEADERS.EDIT_TEAM_LEADER");
  const theme = useTheme<any>();
  const {
    states,
    districts,
    blocks,
    allCenters,
    isMobile,
    isMediumScreen,
    selectedState,
    selectedStateCode,
    selectedDistrict,
    selectedDistrictCode,
    selectedCenter,
    dynamicForm,
    selectedBlock,
    selectedBlockCode,
    handleStateChangeWrapper,
    handleDistrictChangeWrapper,
    handleBlockChangeWrapper,
    handleCenterChangeWrapper,
    selectedCenterCode,
    selectedBlockCohortId,
    blockFieldId,
    districtFieldId,
    stateFieldId,
    dynamicFormForBlock,
    stateDefaultValue,
  } = useLocationState(open, onClose, roleType);

  useEffect(() => {
    const getAddUserFormData = () => {
      try {
        // const response: FormData = await getFormRead(
        //   FormContext.USERS,
        //   userType
        // );
        // const response2= await getFormRead(
        //   FormContext.USERS,
        //   userType
        // );
        // console.log("sortedFields", response);

        const response: FormData =
          userType === FormContextType.TEACHER
            ? teacherFormData
            : userType === FormContextType.STUDENT
              ? studentFormData
              : teamLeaderFormData;
        //    console.log(studentFormData)
        console.log(response);

        if (response) {
          if (userType === FormContextType.TEACHER) {
            const newResponse = {
              ...response,
              fields: response?.fields?.filter(
                (field: any) => field.name !== "no_of_clusters"
              ),
            };
            const { schema, uiSchema, formValues } = GenerateSchemaAndUiSchema(
              newResponse,
              t
            );
            console.log("formValues", formValues);
            setFormValue(formValues);
            setSchema(schema);
            setUiSchema(uiSchema);
            console.log("teacher2");
          } else if (userType === FormContextType.TEAM_LEADER) {
            const { schema, uiSchema, formValues } = GenerateSchemaAndUiSchema(
              response,
              t
            );
            console.log("formValues", formValues);
            setFormValue(formValues);
            setSchema(schema);
            console.log(schema);
            setUiSchema(uiSchema);
          } else {
            console.log("true");
            const { schema, uiSchema } = GenerateSchemaAndUiSchema(response, t);
            setSchema(schema);
            console.log(schema);
            setUiSchema(uiSchema);
          }
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    getAddUserFormData();
  }, [userType, teacherFormData, studentFormData, teamLeaderFormData]);

  const handleSubmit = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    console.log("submitted");
    const target = event?.target as HTMLFormElement;

    console.log("onsubmit", data);

    console.log("Form data submitted:", data.formData);

    const formData = data.formData;
    console.log("Form data submitted:", formData);
    const schemaProperties = schema.properties;
    const result = generateUsernameAndPassword(selectedStateCode, userType);
    if (result !== null) {
      const { username, password } = result;
      const nameParts = formData?.name.trim().split(" ");
      const getUsername =
        nameParts.length > 1
          ? nameParts[0].toLowerCase() + "_" + nameParts[1].toLowerCase()
          : formData?.name.toLowerCase();

      let apiBody: any = {
        username: addCustomCredentional ? getUsername : username,
        password: addCustomCredentional
          ? getUsername + passwordKeys.OBLF
          : password,
        tenantCohortRoleMapping: [
          {
            tenantId: tenantId,
            roleId:
              userType === FormContextType.STUDENT
                ? RoleId.STUDENT
                : userType === FormContextType.TEACHER
                  ? RoleId.TEACHER
                  : RoleId.TEAM_LEADER,
            // cohortId:
            //   userType === FormContextType.TEAM_LEADER
            //     ? [selectedBlockCohortId]
            //     : [selectedCenterCode],
          },
        ],
        // customFields: [],
      };

      Object.entries(formData).forEach(([fieldKey, fieldValue]) => {
        const fieldSchema = schemaProperties[fieldKey];
        const fieldId = fieldSchema?.fieldId;
        console.log(
          `FieldID: ${fieldId}, FieldValue: ${fieldSchema}, type: ${typeof fieldValue}`
        );

        if (fieldId === null || fieldId === "null") {
          if (typeof fieldValue !== "object") {
            apiBody[fieldKey] = fieldValue;
          }
        } else {
          if (
            fieldSchema?.hasOwnProperty("isDropdown") ||
            fieldSchema?.hasOwnProperty("isCheckbox")
          ) {
            apiBody?.customFields?.push({
              fieldId: fieldId,
              value: Array.isArray(fieldValue) ? fieldValue : [fieldValue],
            });
          } else {
            if (fieldSchema?.checkbox && fieldSchema.type === "array") {
              if (String(fieldValue).length != 0) {
                apiBody.customFields.push({
                  fieldId: fieldId,
                  value: String(fieldValue).split(","),
                });
              }
            } else {
              if (fieldId) {
                apiBody.customFields?.push({
                  fieldId: fieldId,
                  value: String(fieldValue),
                });
              }
            }
          }
        }
      });
      if (!isEditModal) {
        // apiBody.customFields?.push({
        //   fieldId: blockFieldId,
        //   value: [selectedBlockCode],
        // });
        // apiBody.customFields.push({
        //   fieldId: stateFieldId,
        //   value: [selectedStateCode],
        // });
        // apiBody.customFields.push({
        //   fieldId: districtFieldId,
        //   value: [selectedDistrictCode],
        // });
      }

      try {
        if (isEditModal && userId) {
          console.log("apiBody", apiBody);
          const userData = {
            name: apiBody?.name,
            mobile: apiBody?.mobile,
            father_name: apiBody?.father_name,
            email: apiBody?.email,
            address: apiBody?.address,
          };
          // const customFields = apiBody?.customFields;
          console.log(customFields);
          const object = {
            userData: userData,
            // customFields: customFields,
          };
          await updateUser(userId, object);
          const messageKey =
            userType === FormContextType.STUDENT
              ? "LEARNERS.LEARNER_UPDATED_SUCCESSFULLY"
              : userType === FormContextType.TEACHER
                ? "FACILITATORS.FACILITATOR_UPDATED_SUCCESSFULLY"
                : "TEAM_LEADERS.TEAM_LEADER_UPDATED_SUCCESSFULLY";

          showToastMessage(t(messageKey), "success");
        } else {
          const response = await createUser(apiBody);
          console.log(
            "ResponsehandleSubmit",
            response?.response?.data?.params?.err
          );

          if (response && response?.userData) {
            console.log("responseIN", response);
            const messageKey = messageKeyMap[userType];

            if (
              userType === FormContextType.STUDENT ||
              userType === FormContextType.TEACHER
            ) {
              showToastMessage(t(messageKey), "success");
            }
            // if(userType===FormContextType.STUDENT)
            // setOpenModal(true);
          } else if (response?.response?.data?.responseCode) {
            showToastMessage(response?.response?.data?.params?.err, "error");
          } else {
            showToastMessage(t("COMMON.SOMETHING_WENT_WRONG"), "error");
          }
        }
        onSubmit(true);
        onClose();
        onCloseModal();

        if (!isEditModal) {
          //  setOpenModal(true);

          const isQueue = false;
          const context = "USER";
          let createrName;
          const key =
            userType === FormContextType.STUDENT
              ? "onLearnerCreated"
              : userType === FormContextType.TEACHER
                ? "onFacilitatorCreated"
                : "onTeamLeaderCreated";

          if (typeof window !== "undefined" && window.localStorage) {
            createrName = localStorage.getItem("name");
          }
          let replacements: { [key: string]: string };
          replacements = {};
          console.log(Object.keys(replacements).length === 0);
          if (createrName) {
            if (userType === FormContextType.STUDENT) {
              replacements = {
                "{FirstName}": createrName,
                "{UserName}": username,
                "{LearnerName}": apiBody["name"],
                "{Password}": password,
              };
            } else {
              replacements = {
                "{FirstName}": apiBody["name"],
                "{UserName}": username,
                "{Password}": password,
              };
            }
          }
          const sendTo = {
            //  receipients: [userEmail],
            receipients:
              userType === FormContextType.STUDENT
                ? [adminInfo?.email]
                : [formData?.email],
          };
          // if (Object.keys(replacements).length !== 0 && sendTo) {
          //   const response = await sendCredentialService({
          //     isQueue,
          //     context,
          //     key,
          //     replacements,
          //     email: sendTo,
          //   });
          //   if (userType !== FormContextType.STUDENT) {
          //     const messageKey = messageKeyMap[userType];

          //     if (response?.result[0]?.data[0]?.status === "success") {
          //       showToastMessage(t(messageKey), "success");
          //     } else {
          //       const messageKey =
          //         delayCredentialsMessageMap[userType] ||
          //         "TEAM_LEADERS.USER_CREDENTIALS_WILL_BE_SEND_SOON";

          //       showToastMessage(t(messageKey), "success");
          //     }
          //   }
          //   if (userType === FormContextType.STUDENT) {
          //     if (
          //       response?.result[0]?.data[0]?.status === "success" &&
          //       !isEditModal
          //     ) {
          //       setOpenModal(true);
          //     } else {
          //       showToastMessage(
          //         t("LEARNERS.USER_CREDENTIALS_WILL_BE_SEND_SOON"),
          //         "success"
          //       );
          //     }
          //   }
          // } else {
          //   showToastMessage(t("COMMON.SOMETHING_WENT_WRONG"), "error");
          // }
        }
      } catch (error) {
        onClose();
        console.log(error);
      }
    }
  };

  const handleSubmitLearners = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    console.log("submitted");

    const target = event?.target as HTMLFormElement;

    console.log("onsubmit", data);

    console.log("Form data submitted:", data.formData);

    const formData = data.formData;
    console.log("Form data submitted:", formData);
    const schemaProperties = schema.properties;
    const result = generateUsernameAndPassword(selectedStateCode, userType);
    if (result !== null) {
      const { username, password } = result;

      const nameParts = formData?.name.trim().split(" ");
      const getUsername =
        nameParts.length > 1
          ? nameParts[0].toLowerCase() + "_" + nameParts[1].toLowerCase()
          : formData?.name.toLowerCase();

      let apiBody: any = {
        username: addCustomCredentional ? getUsername : username,
        password: addCustomCredentional
          ? getUsername + passwordKeys.OBLF
          : password,
        tenantCohortRoleMapping: [
          {
            tenantId: tenantId,
            roleId:
              userType === FormContextType.STUDENT
                ? RoleId.STUDENT
                : userType === FormContextType.TEACHER
                  ? RoleId.TEACHER
                  : RoleId.TEAM_LEADER,
            // cohortId:
            //   userType === FormContextType.TEAM_LEADER
            //     ? [selectedBlockCohortId]
            //     : [selectedCenterCode],
          },
        ],
        customFields: [],
      };

      Object.entries(formData).forEach(([fieldKey, fieldValue]) => {
        const fieldSchema = schemaProperties[fieldKey];
        const fieldId = fieldSchema?.fieldId;

        console.log(
          `FieldID: ${fieldId}, FieldValue: ${fieldSchema}, type: ${typeof fieldValue}`
        );

        if (fieldId === null || fieldId === "null") {
          if (typeof fieldValue !== "object") {
            apiBody[fieldKey] = fieldValue;
          }
        } else {
          if (
            fieldSchema?.hasOwnProperty("isDropdown") ||
            fieldSchema?.hasOwnProperty("isCheckbox")
          ) {
            apiBody.customFields.push({
              fieldId: fieldId,
              value: Array.isArray(fieldValue) ? fieldValue : [fieldValue],
            });
          } else {
            if (fieldSchema?.checkbox && fieldSchema.type === "array") {
              if (String(fieldValue).length != 0) {
                apiBody.customFields.push({
                  fieldId: fieldId,
                  value: String(fieldValue).split(","),
                });
              }
            } else {
              if (fieldId) {
                apiBody.customFields.push({
                  fieldId: fieldId,
                  value: String(fieldValue),
                });
              }
            }
          }
        }
      });
      if (!isEditModal && blockFieldId && stateFieldId && stateFieldId) {
        apiBody.customFields.push({
          fieldId: blockFieldId,
          value: [selectedBlockCode],
        });
        apiBody.customFields.push({
          fieldId: stateFieldId,
          value: [selectedStateCode],
        });
        apiBody.customFields.push({
          fieldId: stateFieldId,
          value: [selectedDistrictCode],
        });
      }

      try {
        if (isEditModal && userId) {
          console.log("apiBody", apiBody);
          const userData = {
            name: apiBody?.name,
            mobile: apiBody?.mobile,
            father_name: apiBody?.father_name,
            email: apiBody?.email,
          };
          const customFields = apiBody?.customFields;
          console.log(customFields);
          const object = {
            userData: userData,
            customFields: customFields,
          };
          await updateUser(userId, object);
          const messageKey =
            userType === FormContextType.STUDENT
              ? "LEARNERS.LEARNER_UPDATED_SUCCESSFULLY"
              : userType === FormContextType.TEACHER
                ? "FACILITATORS.FACILITATOR_UPDATED_SUCCESSFULLY"
                : "TEAM_LEADERS.TEAM_LEADER_UPDATED_SUCCESSFULLY";

          showToastMessage(t(messageKey), "success");
        } else {
          const response = await createUser(apiBody);
          console.log("ResponsehandleSubmitLearners", response);
          if (response && response?.userData) {
            const messageKey = messageKeyMap[userType];

            if (
              userType === FormContextType.STUDENT ||
              userType === FormContextType.TEACHER
            ) {
              showToastMessage(t(messageKey), "success");
            }
            // if(userType===FormContextType.STUDENT)
            // setOpenModal(true);
          } else if (response?.response?.data?.responseCode) {
            showToastMessage(response?.response?.data?.params?.err, "error");
          } else {
            showToastMessage(t("COMMON.SOMETHING_WENT_WRONG"), "error");
          }
        }
        onSubmit(true);
        onClose();
        onCloseModal();

        if (!isEditModal) {
          //  setOpenModal(true);

          const isQueue = false;
          const context = "USER";
          let createrName;
          const key =
            userType === FormContextType.STUDENT
              ? "onLearnerCreated"
              : userType === FormContextType.TEACHER
                ? "onFacilitatorCreated"
                : "onTeamLeaderCreated";

          if (typeof window !== "undefined" && window.localStorage) {
            createrName = localStorage.getItem("name");
          }
          let replacements: { [key: string]: string };
          replacements = {};
          console.log(Object.keys(replacements).length === 0);
          if (createrName) {
            if (userType === FormContextType.STUDENT) {
              replacements = {
                "{FirstName}": createrName,
                "{UserName}": username,
                "{LearnerName}": apiBody["name"],
                "{Password}": password,
              };
            } else {
              replacements = {
                "{FirstName}": apiBody["name"],
                "{UserName}": username,
                "{Password}": password,
              };
            }
          }
          const sendTo = {
            //  receipients: [userEmail],
            receipients:
              userType === FormContextType.STUDENT
                ? [adminInfo?.email]
                : [formData?.email],
          };
          // if (Object.keys(replacements).length !== 0 && sendTo) {
          //   const response = await sendCredentialService({
          //     isQueue,
          //     context,
          //     key,k
          //     replacements,
          //     email: sendTo,
          //   });
          //   if (userType !== FormContextType.STUDENT) {
          //     const messageKey = messageKeyMap[userType];

          //     if (response?.result[0]?.data[0]?.status === "success") {
          //       showToastMessage(t(messageKey), "success");
          //     } else {
          //       const messageKey =
          //         delayCredentialsMessageMap[userType] ||
          //         "TEAM_LEADERS.USER_CREDENTIALS_WILL_BE_SEND_SOON";

          //       showToastMessage(t(messageKey), "success");
          //     }
          //   }
          //   if (userType === FormContextType.STUDENT) {
          //     if (
          //       response?.result[0]?.data[0]?.status === "success" &&
          //       !isEditModal
          //     ) {
          //       setOpenModal(true);
          //     } else {
          //       showToastMessage(
          //         t("LEARNERS.USER_CREDENTIALS_WILL_BE_SEND_SOON"),
          //         "success"
          //       );
          //     }
          //   }
          // } else {
          //   showToastMessage(t("COMMON.SOMETHING_WENT_WRONG"), "error");
          // }
        }
      } catch (error) {
        onClose();
        console.log(error);
      }
    }
  };

  const handleChange = (event: IChangeEvent<any>) => {
    console.log("Form data changed:", event.formData);
  };

  const handleError = (errors: any) => {
    console.log("Form errors:", errors);
  };
  const handleBackAction = () => {
    setCreateFacilitator(false);
    setOpenModal(false);
  };

  const handleAction = () => {
    setTimeout(() => {
      setCreateFacilitator(true);
    });
    setOpenModal(false);
  };
  const onCloseModal = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    if (!open) {
      setSubmitButtonEnable(false);
    }
    if (
      (dynamicForm && userType !== FormContextType.TEAM_LEADER) ||
      isEditModal
    ) {
      setSubmitButtonEnable(true);
    }
    if (
      (dynamicFormForBlock && userType === FormContextType.TEAM_LEADER) ||
      isEditModal
    ) {
      setSubmitButtonEnable(true);
    }
  }, [dynamicForm, dynamicFormForBlock, open]);
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const admin = localStorage.getItem("adminInfo");
      if (admin) setAdminInfo(JSON.parse(admin));
      console.log(adminInfo?.email);
    }
  }, []);

  const handleChangeForm = (event: IChangeEvent<any>) => {
    console.log("Form data changed:", event.formData);
  };
  console.log("userType", userType);
  return (
    <>
      <SimpleModal
        open={open}
        onClose={onClose}
        showFooter={isEditModal}
        modalTitle={modalTitle}
        footer={
          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={onClose}
              sx={{
                color: "secondary",
                fontSize: "14px",
                fontWeight: "500",
              }}
              variant="outlined"
            >
              {t("COMMON.CANCEL")}
            </Button>
            <Button
              variant="contained"
              type="submit"
              form={
                userType === FormContextType.STUDENT && !isEditModal
                  ? "dynamic-form"
                  : isEditModal
                    ? "dynamic-form"
                    : ""
              } // Add this line
              sx={{
                fontSize: "14px",
                fontWeight: "500",
                width: "auto",
                height: "40px",
                marginLeft: "10px",
              }}
              color="primary"
              disabled={!submitButtonEnable}
              onClick={() => {
                setSubmittedButtonStatus(true);
                // if (userType !== FormContextType.STUDENT && !isEditModal && noError) {
                //   setOpenModal(true);
                // }
                console.log(submittedButtonStatus);
                console.log(noError);
                if (
                  userType !== FormContextType.STUDENT &&
                  !isEditModal &&
                  noError
                ) {
                  setOpenModal(true);
                }
                console.log("Submit button was clicked");
              }}
            >
              {!isEditModal ? t("COMMON.CREATE") : t("COMMON.UPDATE")}
            </Button>
          </Box>
        }
      >
        {!isEditModal && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            {/* <AreaSelection
            states={transformArray(states)}
            districts={transformArray(districts)}
            blocks={transformArray(blocks)}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedBlock={selectedBlock}
            handleStateChangeWrapper={handleStateChangeWrapper}
            handleDistrictChangeWrapper={handleDistrictChangeWrapper}
            handleBlockChangeWrapper={handleBlockChangeWrapper}
            isMobile={isMobile}
            isMediumScreen={isMediumScreen}
            isCenterSelection={userType !== "TEAM LEADER"}
            allCenters={allCenters}
            selectedCenter={selectedCenter}
            handleCenterChangeWrapper={handleCenterChangeWrapper}
            inModal={true}
            stateDefaultValue={stateDefaultValue}
          /> */}
            {schema && uiSchema && (
              <DynamicForm
                schema={schema}
                uiSchema={uiSchema}
                onSubmit={
                  // userType === FormContextType.TEACHER
                  //   ? handleSubmit
                  //   :
                     handleSubmitLearners
                }
                // onChange={handleChangeFormCreate}
                // onError={handleErrorCreate}
                widgets={{}}
                showErrorList={true}
                customFields={customFields}
                id="new-user-form"
                onChange={handleChangeForm}
                onError={handleError}
              >
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "right", // Centers the button horizontally
                    marginTop: "20px", // Adjust margin as needed
                  }}
                  gap={2}
                >
                  <Button
                    variant="outlined"
                    type="submit"
                    form="new-user-form" // Add this line
                    sx={{
                      fontSize: "14px",
                      fontWeight: "500",
                      width: "auto",
                      height: "40px",
                      marginLeft: "10px",
                    }}
                    onClick={onClose}
                  >
                    {t("COMMON.CANCEL")}
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    form="new-user-form" // Add this line
                    sx={{
                      fontSize: "14px",
                      fontWeight: "500",
                      width: "auto",
                      height: "40px",
                      marginLeft: "10px",
                    }}
                    onClick={() => {
                      setSubmittedButtonStatus(true);
                      console.log("Submit button was clicked");
                    }}
                  >
                    {t("COMMON.CREATE")}
                  </Button>
                </Box>
              </DynamicForm>
            )}
          </Box>
        )}
        {formData
          ? schema &&
            uiSchema && (
              <DynamicForm
                id="dynamic-form"
                schema={schema}
                uiSchema={uiSchema}
                onSubmit={
                  // userType === FormContextType.TEACHER
                  //   ? handleSubmit
                  //   : 
                    handleSubmitLearners
                }
                onChange={handleChange}
                onError={handleError}
                widgets={{}}
                showErrorList={true}
                customFields={customFields}
                formData={formData}
              >
                {/* <CustomSubmitButton onClose={primaryActionHandler} /> */}
              </DynamicForm>
            )
          : userType === FormContextType.TEACHER
            ? dynamicFormForBlock &&
              schema &&
              uiSchema && (
                <DynamicForm
                  id="dynamic-form"
                  schema={schema}
                  uiSchema={uiSchema}
                  onSubmit={handleSubmitLearners}
                  onChange={handleChange}
                  onError={handleError}
                  // widgets={{}}
                  showErrorList={true}
                  customFields={customFields}
                  formData={formValue}
                >
                  {/* <CustomSubmitButton onClose={primaryActionHandler} /> */}
                </DynamicForm>
              )
            : dynamicForm &&
              schema &&
              uiSchema && (
                <DynamicForm
                  id="dynamic-form"
                  schema={schema}
                  uiSchema={uiSchema}
                  onSubmit={
                    // userType === "Teachers"
                    //   ? handleSubmit
                    //   : 
                      handleSubmitLearners
                  }
                  onChange={handleChange}
                  onError={handleError}
                  // widgets={{}}
                  showErrorList={true}
                  customFields={customFields}
                  formData={formValue}
                >
                  {/* <CustomSubmitButton onClose={primaryActionHandler} /> */}
                </DynamicForm>
              )}
      </SimpleModal>
      <SendCredentialModal
        handleBackAction={handleBackAction}
        open={openModal}
        onClose={onCloseModal}
        email={
          userType !== FormContextType.STUDENT
            ? userEnteredEmail
            : adminInfo?.email
        }
        userType={
          userType === FormContextType.STUDENT
            ? Role.STUDENT
            : userType === FormContextType.TEAM_LEADER
              ? Role.TEAM_LEADER
              : Role.TEACHER
        }
      />
    </>
  );
};

export default CommonUserModal;
