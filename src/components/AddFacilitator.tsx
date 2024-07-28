import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import { Typography, useMediaQuery } from "@mui/material";
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from "@/components/GeneratedSchemas";
import { FormContext, FormContextType } from "@/utils/app.constant";
import DynamicForm from "@/components/DynamicForm";
import SendCredentialModal from "@/components/SendCredentialModal";
import SimpleModal from "@/components/SimpleModal";
import { createUser, getFormRead } from "@/services/CreateUserService";
import { generateUsernameAndPassword } from "@/utils/Helper";
import { FormData } from "@/utils/Interfaces";
import { RoleId } from "@/utils/app.constant";
import AreaSelection from "./AreaSelection";
import { showToastMessage } from "./Toastify";
import { transformArray } from "../utils/Helper";
import { useLocationState } from "@/utils/useLocationState"; 

interface AddFacilitatorModalprops {
  open: boolean;
  onClose: () => void;
}

const AddFacilitatorModal: React.FC<AddFacilitatorModalprops> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const [schema, setSchema] = useState<any>();
  const [openModal, setOpenModal] = useState(false);
  const [uiSchema, setUiSchema] = useState<any>();

  const {
    states, districts, blocks, allCenters, isMobile, isMediumScreen,
    selectedState, selectedStateCode, selectedDistrict, selectedDistrictCode,
    selectedCenter, dynamicForm, selectedBlock, selectedBlockCode,
    handleStateChangeWrapper, handleDistrictChangeWrapper, handleBlockChangeWrapper, handleCenterChangeWrapper
  } = useLocationState(open, onClose);

  useEffect(() => {
    const getAddLearnerFormData = async () => {
      try {
        const response: FormData = await getFormRead(
          FormContext.USERS,
          FormContextType.TEACHER
        );
        console.log("sortedFields", response);
        if (typeof window !== "undefined" && window.localStorage) {
          const CenterList = localStorage.getItem("CenterList");
          const centerOptions = CenterList ? JSON.parse(CenterList) : [];
          var centerOptionsList = centerOptions?.map(
            (center: { cohortId: string; cohortName: string }) => ({
              value: center.cohortId,
              label: center.cohortName,
            })
          );
          console.log(centerOptionsList);
        }
        
        if (response) {
          const { schema, uiSchema } = GenerateSchemaAndUiSchema(response, t);
          setSchema(schema);
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

    for (const element of elementsArray) {
      if (
        (element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement) &&
        (element.value === "" ||
          (Array.isArray(element.value) && element.value.length === 0))
      ) {
        element.focus();
        return;
      }
    }

    const formData = data.formData;
    console.log("Form data submitted:", formData);
    const schemaProperties = schema.properties;

    const { username, password } = generateUsernameAndPassword("MH", "F");

    let apiBody: any = {
      username: username,
      password: password,
      tenantCohortRoleMapping: [
        {
          tenantId: "ef99949b-7f3a-4a5f-806a-e67e683e38f3",
          roleId: RoleId.TEACHER,
          cohortId: ["3f6825ab-9c94-4ee4-93e8-ef21e27dcc67"],
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

    console.log(apiBody);
try{
  const response = await createUser(apiBody);
  onClose();
  showToastMessage(t('FACILITATORS.FACILITATOR_CREATED_SUCCESSFULLY'), 'success');
}
catch(error)
{
  console.log(error);
}
  };

  const handleChange = (event: IChangeEvent<any>) => {
    console.log("Form data changed:", event.formData);
  };

  const handleError = (errors: any) => {
    console.log("Form errors:", errors);
  };

  const onCloseModal = () => {
    setOpenModal(false);
    onClose();
  };

  return (
    <>
      <SimpleModal
        open={open}
        onClose={onClose}
        showFooter={false}
        modalTitle={t("FACILITATORS.NEW_FACILITATOR")}
      >
        {!dynamicForm && (
          <Typography>
            {t("LEARNERS.FIRST_SELECT_REQUIRED_FIELDS")}{" "}
          </Typography>
        )}
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
        {dynamicForm && schema && uiSchema && (
          <DynamicForm
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onError={handleError}
            widgets={{}}
            showErrorList={true}
            customFields={customFields}
          />
        )}
      </SimpleModal>
      <SendCredentialModal open={openModal} onClose={onCloseModal} />
    </>
  );
};

export default AddFacilitatorModal;
