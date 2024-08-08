import DynamicForm from "@/components/DynamicForm";
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from "@/components/GeneratedSchemas";
import SimpleModal from "@/components/SimpleModal";
import { getFormRead } from "@/services/CreateUserService";
import { CustomField } from "@/utils/Interfaces";
import { CohortTypes } from "@/utils/app.constant";
import { useLocationState } from "@/utils/useLocationState";
import { Box , Button} from "@mui/material";
import { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { transformArray } from "../utils/Helper";
import AreaSelection from "./AreaSelection";
import { showToastMessage } from "./Toastify";
import { createCohort } from "@/services/CohortService/cohortService";

interface CohortDetails {
  name?: string;
  type?: string;
  parentId?: string | null;
  customFields?: CustomField[];
}
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
const AddNewCenters: React.FC<AddLearnerModalProps> = ({
  open,
  onClose,
  formData,
  isEditModal = false,
  userId,
}) => {
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [openAddNewCohort, setOpenAddNewCohort] =
    React.useState<boolean>(false);

  const { t } = useTranslation();
  const {
    states,
    districts,
    blocks,
    allCenters,
    isMobile,
    isMediumScreen,
    selectedState,
    selectedDistrict,
    selectedCenter,
    selectedBlock,
    handleStateChangeWrapper,
    handleDistrictChangeWrapper,
    handleBlockChangeWrapper,
    handleCenterChangeWrapper,
    selectedBlockCohortId,
    dynamicFormForBlock,
  } = useLocationState(open, onClose);

  useEffect(() => {
    const getAddLearnerFormData = async () => {
      try {
        const response = await getFormRead("cohorts", "cohort");
        console.log("sortedFields", response);

        if (response) {
          const { schema, uiSchema } = GenerateSchemaAndUiSchema(response, t);
          console.log("schema", schema);
          console.log("uiSchema", uiSchema);
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
    event: React.FormEvent<any>,
  ) => {
    const formData = data?.formData;
    console.log( selectedBlockCohortId)

    if (selectedBlockCohortId) {
      console.log("handlesubmit" , selectedBlockCohortId)

      const parentId = selectedBlockCohortId;
      const cohortDetails: CohortDetails = {
        name: formData.name,
        type: CohortTypes.COHORT,
        parentId: parentId,
        customFields: [],
      };

      Object.entries(formData).forEach(([fieldKey, fieldValue]) => {
        const fieldSchema = schema.properties[fieldKey];
        const fieldId = fieldSchema?.fieldId;

        if (fieldId !== null) {
          cohortDetails?.customFields?.push({
            fieldId: fieldId,
            value: formData.cohort_type,
          });
        }
      });
      if (
        cohortDetails?.customFields &&
        cohortDetails?.customFields?.length > 0 &&
        cohortDetails?.name
      ) {
        const cohortData = await createCohort(cohortDetails);
        if (cohortData) {
          showToastMessage(t("CENTERS.CENTER_CREATED_SUCCESSFULLY"), "success");
          setOpenAddNewCohort(false);
          onClose();
        }
      } else {
        showToastMessage("Please Input Data", "warning");
      }
    } else {
      showToastMessage(t("CENTER.NOT_ABLE_CREATE_CENTER"), "error");
    }
  };

  const handleChangeForm = (event: IChangeEvent<any>) => {
    console.log("Form data changed:", event.formData);
  };

  const handleError = () => {
    console.log("error");
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      showFooter={false}
      modalTitle={t("CENTERS.NEW_CENTER")}
    >
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
          isCenterSelection={false}
          allCenters={allCenters}
          selectedCenter={selectedCenter}
          handleCenterChangeWrapper={handleCenterChangeWrapper}
        />
      </Box>

      {dynamicFormForBlock && schema && uiSchema && (
        <DynamicForm
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={handleSubmit}
          onChange={handleChangeForm}
          onError={handleError}
          widgets={{}}
          showErrorList={true}
          customFields={customFields}
          id="xyz"
        >
<Button
              variant="contained"
              type="submit"
             form="xyz" // Add this line
              sx={{
                padding: '12px 24px', // Adjust padding as needed
                width: '200px', // Set the desired width
              }}
              // disabled={!submitButtonEnable}
              // onClick={() => {
              //   setSubmittedButtonStatus(true);
              //   console.log("Submit button was clicked");
              // }}
            >
              add
              {/* {!isEditModal?t("COMMON.ADD"):t("COMMON.UPDATE")} */}
            </Button>

        </DynamicForm>
      )}
    </SimpleModal>
  );
};

export default AddNewCenters;
