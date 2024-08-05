import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import {
  Typography,
  useMediaQuery,
  Box,
  Button,
  useTheme,
} from "@mui/material";
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from "@/components/GeneratedSchemas";
import { FormContext, FormContextType } from "@/utils/app.constant";
import DynamicForm from "@/components/DynamicForm";
import SendCredentialModal from "@/components/SendCredentialModal";
import SimpleModal from "@/components/SimpleModal";
import {
  createUser,
  getFormRead,
  updateUser,
} from "@/services/CreateUserService";
import { generateUsernameAndPassword } from "@/utils/Helper";
import { FormData } from "@/utils/Interfaces";
import { RoleId, Role } from "@/utils/app.constant";
import AreaSelection from "./AreaSelection";
import { showToastMessage } from "./Toastify";
import { transformArray } from "../utils/Helper";
import { useLocationState } from "@/utils/useLocationState";
import { tenantId } from "../../app.config";

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
  const { t } = useTranslation();
  const [formValue, setFormValue] = useState<any>();
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
    distrctFieldId,
    stateFieldId,
    dynamicFormForBlock,
  } = useLocationState(open, onClose);

  useEffect(() => {
    const getAddUserFormData = async () => {
      try {
        const response: FormData = await getFormRead(
          FormContext.USERS,
          userType,
        );

        console.log("sortedFields", response);

        if (response) {
          if (userType === FormContextType.TEACHER) {
            const newResponse = {
              ...response,
              fields: response.fields.filter(
                (field) => field.name !== "no_of_clusters",
              ),
            };
            const { schema, uiSchema, formValues } = GenerateSchemaAndUiSchema(
              newResponse,
              t,
            );
            setFormValue(formValues);
            setSchema(schema);
            setUiSchema(uiSchema);
          } else if (userType === FormContextType.TEAM_LEADER) {
            const { schema, uiSchema, formValues } = GenerateSchemaAndUiSchema(
              response,
              t,
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
  }, []);

  const handleSubmit = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>,
  ) => {
    // setOpenModal(true);
    const target = event.target as HTMLFormElement;
    // const elementsArray = Array.from(target.elements);

    console.log("onsubmit", data);
    // for (const element of elementsArray) {
    //   if (
    //     (element instanceof HTMLInputElement ||
    //       element instanceof HTMLSelectElement ||
    //       element instanceof HTMLTextAreaElement) &&
    //     (element.value === "" ||
    //       (Array.isArray(element.value) && element.value.length === 0))
    //   ) {
    //     element.focus();
    //     return;
    //   }
    // }
    console.log("Form data submitted:", data.formData);

    const formData = data.formData;
    console.log("Form data submitted:", formData);
    const schemaProperties = schema.properties;
    const result = generateUsernameAndPassword(selectedStateCode, userType);
    if (result !== null) {
      const { username, password } = result;
      // You can now use username and password safely here
    
    // const { username, password } = generateUsernameAndPassword(
    //   selectedStateCode,
    //   userType
    // );

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
        `FieldID: ${fieldId}, FieldValue: ${fieldSchema}, type: ${typeof fieldValue}`,
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
            value: [String(fieldValue)],
          });
         
        
        } else {
          if (fieldSchema.checkbox && fieldSchema.type === "array" && isEditModal) {
            apiBody.customFields.push({
              fieldId: fieldId,
              value: String(fieldValue).split(","),
            });
          } else {
            apiBody.customFields.push({
              fieldId: fieldId,
              value: String(fieldValue),
            });
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
        fieldId: distrctFieldId,
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
        const response = await updateUser(userId, object);
        const messageKey =
          userType === FormContextType.STUDENT
            ? "LEARNERS.LEARNER_UPDATED_SUCCESSFULLY"
            : userType === FormContextType.TEACHER
              ? "FACILITATORS.FACILITATOR_UPDATED_SUCCESSFULLY"
              : "TEAM_LEADERS.TEAM_LEADER_UPDATED_SUCCESSFULLY";

        showToastMessage(t(messageKey), "success");
      } else {
        const response = await createUser(apiBody);
        if (response) {

        const messageKey =
          userType === FormContextType.STUDENT
            ? "LEARNERS.LEARNER_CREATED_SUCCESSFULLY"
            : userType === FormContextType.TEACHER
              ? "FACILITATORS.FACILITATOR_CREATED_SUCCESSFULLY"
              : "TEAM_LEADERS.TEAM_LEADER_CREATED_SUCCESSFULLY";

        showToastMessage(t(messageKey), "success");
        }
      }
      onSubmit(true);
      onClose();
    } catch (error) {
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');

      onClose();
      console.log(error);
    }
  }};

  const handleChange = (event: IChangeEvent<any>) => {
    console.log("Form data changed:", event.formData);
    // setFormData({
    //   ...formData,
    //   [event.target.name]: event.target.value
    // });
  };

  const handleError = (errors: any) => {
    console.log("Form errors:", errors);
  };

  const CustomSubmitButton: React.FC<{ onClose: () => void }> = ({
    onClose,
  }) => (
    <div
      style={{
        marginTop: "16px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            "&.Mui-disabled": {
              backgroundColor: theme?.palette?.primary?.main,
            },
            minWidth: "84px",
            height: "2.5rem",
            padding: theme.spacing(1),
            fontWeight: "500",
            width: "48%",
          }}
          onClick={onClose}
        >
          {t("COMMON.BACK")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            "&.Mui-disabled": {
              backgroundColor: theme?.palette?.primary?.main,
            },
            minWidth: "84px",
            height: "2.5rem",
            padding: theme.spacing(1),
            fontWeight: "500",
            width: "48%",
            marginLeft: "50%",
          }}
          onClick={secondaryActionHandler}
        >
          {t("COMMON.SUBMIT")}
        </Button>
      </>
    </div>
  );

  const primaryActionHandler = () => {
    onClose();
  };

  const secondaryActionHandler = async (e: React.FormEvent) => {
    // console.log('Secondary action handler clicked');
    e.preventDefault();
    // handleGenerateCredentials();
    // try {
    //   const response = await createUser(learnerFormData);
    //   console.log('User created successfully', response);
    // } catch (error) {
    //   console.error('Error creating user', error);
    // }
  };

  return (
    <>
      <SimpleModal
        open={open}
        onClose={onClose}
        showFooter={false}
        modalTitle={modalTitle}
      >
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            {/* {!dynamicForm && (
              <Typography>
                {t("LEARNERS.FIRST_SELECT_REQUIRED_FIELDS")}{" "}
              </Typography>
            )} */}
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
              isCenterSelection={userType !== "TEAM LEADER" ? true : false}
              allCenters={allCenters}
              selectedCenter={selectedCenter}
              handleCenterChangeWrapper={handleCenterChangeWrapper}
            />
          </Box>
        </>

        {formData
          ? schema &&
            uiSchema && (
              <DynamicForm
                schema={schema}
                uiSchema={uiSchema}
                onSubmit={handleSubmit}
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
          : userType === "TEAM LEADER"
            ? dynamicFormForBlock &&
              schema &&
              uiSchema && (
                <DynamicForm
                  schema={schema}
                  uiSchema={uiSchema}
                  onSubmit={handleSubmit}
                  onChange={handleChange}
                  onError={handleError}
                  widgets={{}}
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
                  schema={schema}
                  uiSchema={uiSchema}
                  onSubmit={handleSubmit}
                  onChange={handleChange}
                  onError={handleError}
                  widgets={{}}
                  showErrorList={true}
                  customFields={customFields}
                  formData={formValue}
                >
                  {/* <CustomSubmitButton onClose={primaryActionHandler} /> */}
                </DynamicForm>
              )}
      </SimpleModal>
    </>
  );
};
CommonUserModal.defaultProps = {
  onSubmit: () => {}, // Default to a no-op function
};
export default CommonUserModal;
