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
import { FormContext, FormContextType, RoleId } from "@/utils/app.constant";
import { useLocationState } from "@/utils/useLocationState";
import useSubmittedButtonStore from "@/utils/useSharedState";
import { Box, Button, useTheme } from "@mui/material";
import { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { tenantId } from "../../app.config";
import { transformArray } from "../utils/Helper";
import AreaSelection from "./AreaSelection";
import { showToastMessage } from "./Toastify";
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
  const [submitButtonEnable, setSubmitButtonEnable] =
    React.useState<boolean>(false);
  const roleType = userType;
  const { t } = useTranslation();
  const [formValue, setFormValue] = useState<any>();
  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );

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
  } = useLocationState(open, onClose, roleType);

  useEffect(() => {
    const getAddUserFormData = async () => {
      try {
        const response: FormData = await getFormRead(
          FormContext.USERS,
          userType
        );

        console.log("sortedFields", response);

        if (response) {
          if (userType === FormContextType.TEACHER) {
            const newResponse = {
              ...response,
              fields: response.fields.filter(
                (field) => field.name !== "no_of_clusters"
              ),
            };
            const { schema, uiSchema, formValues } = GenerateSchemaAndUiSchema(
              newResponse,
              t
            );
            setFormValue(formValues);
            setSchema(schema);
            setUiSchema(uiSchema);
            console.log("teacher2")
          } else if (userType === FormContextType.TEAM_LEADER) {
            const { schema, uiSchema, formValues } = GenerateSchemaAndUiSchema(
              response,
              t
            );
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
  }, [userType]);

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

      let apiBody: any = {
        username: username,
        password: password,
        tenantCohortRoleMapping: [
          {
            tenantId: tenantId,
            roleId:
              userType === FormContextType.STUDENT
                ? RoleId.STUDENT
                : userType === FormContextType.TEACHER
                  ? RoleId.TEACHER
                  : RoleId.TEAM_LEADER,
            cohortId:
              userType === FormContextType.TEAM_LEADER
                ? [selectedBlockCohortId]
                : [selectedCenterCode],
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
      if (!isEditModal) {
        apiBody.customFields.push({
          fieldId: blockFieldId,
          value: [selectedBlockCode],
        });
        apiBody.customFields.push({
          fieldId: stateFieldId,
          value: [selectedStateCode],
        });
        apiBody.customFields.push({
          fieldId: districtFieldId,
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
          console.log(response);
          if (response) {
            const messageKey =
              userType === FormContextType.STUDENT
                ? "LEARNERS.LEARNER_CREATED_SUCCESSFULLY"
                : userType === FormContextType.TEACHER
                  ? "FACILITATORS.FACILITATOR_CREATED_SUCCESSFULLY"
                  : "TEAM_LEADERS.TEAM_LEADER_CREATED_SUCCESSFULLY";

            showToastMessage(t(messageKey), "success");
          } else {
            showToastMessage(t("COMMON.SOMETHING_WENT_WRONG"), "error");
          }
        }

        onSubmit(true);
        onClose();
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
  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      showFooter={true}
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
            form="dynamic-form" // Add this line
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
          <AreaSelection
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
          />
        </Box>
      )}
      {formData
        ? schema &&
          uiSchema && (
            <DynamicForm
              id="dynamic-form"
              schema={schema}
              uiSchema={uiSchema}
              onSubmit={handleSubmit}
              onChange={handleChange}
              onError={handleError}
              // widgets={{}}
              showErrorList={true}
              customFields={customFields}
              formData={formData}
            >
              {/* <CustomSubmitButton onClose={primaryActionHandler} /> */}
            </DynamicForm>
          )
        : userType === FormContextType.TEAM_LEADER
          ? dynamicFormForBlock &&
            schema &&
            uiSchema && (
              <DynamicForm
                id="dynamic-form"
                schema={schema}
                uiSchema={uiSchema}
                onSubmit={handleSubmit}
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
                onSubmit={handleSubmit}
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
  );
};

export default CommonUserModal;
