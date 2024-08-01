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
  Role,
  RoleId,
} from "@/utils/app.constant";
import { useLocationState } from "@/utils/useLocationState";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { transformArray } from "../utils/Helper";
import AreaSelection from "./AreaSelection";
import { showToastMessage } from "./Toastify";
import { tenantId } from "../../app.config";

interface AddLearnerModalProps {
  open: boolean;
  onClose: () => void;
  formData?: object;
  isEditModal?: boolean;
  userId?: string;
}
interface FieldProp {
  value: string;
  label: string;
}
const AddLearnerModal: React.FC<AddLearnerModalProps> = ({
  open,
  onClose,
  formData,
  isEditModal = false,
  userId,
}) => {
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();

  const [credentials, setCredentials] = React.useState({
    username: "",
    password: "",
  });
  const { t } = useTranslation();
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
  } = useLocationState(open, onClose);

  useEffect(() => {
    const getAddLearnerFormData = async () => {
      try {
        const response: FormData = await getFormRead(
          FormContext.USERS,
          FormContextType.STUDENT
        );
        console.log("sortedFields", response);

        if (response) {
          const { schema, uiSchema } = GenerateSchemaAndUiSchema(response, t);
          setSchema(schema);
          console.log(schema);
          setUiSchema(uiSchema);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    getAddLearnerFormData();
  }, []);

  const handleSubmit = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    // setOpenModal(true);
    const target = event.target as HTMLFormElement;
    const elementsArray = Array.from(target.elements);

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
    let cohortId;
    if (typeof window !== "undefined" && window.localStorage) {
      var teacherData = JSON.parse(localStorage.getItem("teacherApp") || "");
      cohortId = "3f6825ab-9c94-4ee4-93e8-ef21e27dcc67";
    }
    const { username, password } = generateUsernameAndPassword(
      selectedStateCode,
      Role.STUDENT
    );

    let apiBody: any = {
      username: username,
      password: password,
      tenantCohortRoleMapping: [
        {
          tenantId: tenantId,
          roleId: RoleId.STUDENT,
          cohortId: [selectedCenterCode],
        },
      ],
      customFields: [],
    };

    Object.entries(formData).forEach(([fieldKey, fieldValue]) => {
      const fieldSchema = schemaProperties[fieldKey];
      const fieldId = fieldSchema?.fieldId;
      console.log(
        `FieldID: ${fieldId}, FieldValue: ${fieldValue}, type: ${typeof fieldValue}`
      );

      if (fieldId === null || fieldId === "null") {
        if (typeof fieldValue !== "object") {
          apiBody[fieldKey] = fieldValue;
        }
      } else {
        if (
          fieldSchema?.hasOwnProperty("isDropdown") ||
          fieldSchema.hasOwnProperty("isCheckbox")
        ) {
          apiBody.customFields.push({
            fieldId: fieldId,
            value: [String(fieldValue)],
          });
        } else {
          apiBody.customFields.push({
            fieldId: fieldId,
            value: String(fieldValue),
          });
        }
      }
    });
    if (!isEditModal) {
      apiBody.customFields.push({
        fieldId: "a717bb68-5c8a-45cb-b6dd-376caa605736",
        value: [selectedBlockCode],
      });
      apiBody.customFields.push({
        fieldId: "61b5909a-0b45-4282-8721-e614fd36d7bd",
        value: [selectedStateCode],
      });
      apiBody.customFields.push({
        fieldId: "aecb84c9-fe4c-4960-817f-3d228c0c7300",
        value: [selectedDistrictCode],
      });
    }

    try {
      if (isEditModal && userId) {
        console.log("apiBody", apiBody);
        const userData = {
          name: apiBody.name,
          mobile: apiBody.mobile,
          father_name: apiBody.father_name,
        };
        const customFields = apiBody.customFields;
        console.log(customFields);
        const object = {
          userData: userData,
          customFields: customFields,
        };
        const response = await updateUser(userId, object);
        showToastMessage(t("LEARNERS.LEARNER_UPDATED_SUCCESSFULLY"), "success");
      } else {
        const response = await createUser(apiBody);
        showToastMessage(t("LEARNERS.LEARNER_CREATED_SUCCESSFULLY"), "success");
      }
      onClose();
    } catch (error) {
      onClose();
      console.log(error);
    }
  };

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
        modalTitle={t("LEARNERS.NEW_LEARNER")}
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
              isCenterSelection={true}
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
              >
                {/* <CustomSubmitButton onClose={primaryActionHandler} /> */}
              </DynamicForm>
            )}
      </SimpleModal>
    </>
  );
};

export default AddLearnerModal;
