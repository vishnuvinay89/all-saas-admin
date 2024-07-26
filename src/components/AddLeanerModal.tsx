import DynamicForm from "@/components/DynamicForm";
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from "@/components/GeneratedSchemas";
import SimpleModal from "@/components/SimpleModal";
import { createUser, getFormRead } from "@/services/CreateUserService";
import { generateUsernameAndPassword } from "@/utils/Helper";
import { FormData } from "@/utils/Interfaces";
import {
  FormContext,
  FormContextType,
  Role,
  RoleId,
} from "@/utils/app.constant";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  getBlockList,
  getDistrictList,
  getStateBlockDistrictList ,
} from "../services/MasterDataService";
import MultipleSelectCheckmarks from "./FormControl";
import { showToastMessage } from "./Toastify";
import AreaSelection from "./AreaSelection";
import { transformArray } from "../utils/Helper";

interface AddLearnerModalProps {
  open: boolean;
  onClose: () => void;
}
interface FieldProp {
  value: string;
  label: string;
}
const AddLearnerModal: React.FC<AddLearnerModalProps> = ({ open, onClose }) => {
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [states, SetStates] = React.useState<FieldProp[]>([]);
  const [districts, SetDistricts] = React.useState<FieldProp[]>([]);
  const [blocks, setBlocks] = React.useState<FieldProp[]>([]);
  const [centers, setCenters] = React.useState<FieldProp[]>([]);

  const [selectedState, setSelectedState] = React.useState<string[]>([]);
  const [selectedStateCode, setSelectedStateCode] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState<string[]>([]);
  const [selectedDistrictCode, setSelectedDistrictCode] = React.useState("");
  const [selectedCenter, setSelectedCenter] = React.useState<string[]>([]);

  const [selectedBlock, setSelectedBlock] = React.useState<string[]>([]);
  const [selectedBlockCode, setSelectedBlockCode] = React.useState("");
  const [credentials, setCredentials] = React.useState({
    username: "",
    password: "",
  });
  const [dynamicForm, setDynamicForm] = React.useState<any>(false);
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:986px)");

  const handleStateChangeWrapper = async (
    selectedNames: string[],
    selectedCodes: string[]
  ) => {
    try {
      const object=
        {
          
           "controllingfieldfk": selectedStateCode,
         
           "fieldName": "districts"
           
         }
            const response = await getStateBlockDistrictList(object);
      const result = response?.result;
      SetDistricts(result);
    } catch (error) {
      console.log(error);
    }
    handleStateChange(selectedNames, selectedCodes);
  };

  const handleDistrictChangeWrapper = async (
    selected: string[],
    selectedCodes: string[]
  ) => {
    if (selected[0] === "") {
      handleBlockChange([], []);
    }
    try {
      const object=
      {
        
         "controllingfieldfk": selectedDistrictCode,
       
         "fieldName": "blocks"
         
       }
      const response = await getStateBlockDistrictList(object);
      const result = response?.result;
      setBlocks(result);
    } catch (error) {
      console.log(error);
    }
    handleDistrictChange(selected, selectedCodes);
  };

  const handleBlockChangeWrapper = (
    selected: string[],
    selectedCodes: string[]
  ) => {
    handleBlockChange(selected, selectedCodes);
  };
  const handleCenterChangeWrapper = (
    selected: string[],
    selectedCodes: string[]
  ) => {
    handleCenterChange(selected, selectedCodes);
  };
  const handleStateChange = async (selected: string[], code: string[]) => {
    setSelectedDistrict([]);
    setSelectedBlock([]);

    setSelectedState(selected);

    {
      const stateCodes = code?.join(",");
      setSelectedStateCode(stateCodes);
    }

    console.log("Selected categories:", typeof code[0]);
  };

  const handleDistrictChange = (selected: string[], code: string[]) => {
    setSelectedBlock([]);
    setSelectedDistrict(selected);

    {
      const districts = code?.join(",");
      setSelectedDistrictCode(districts);
    }
    console.log("Selected categories:", selected);
  };
  const handleBlockChange = (selected: string[], code: string[]) => {
    setSelectedBlock(selected);

    const blocks = code?.join(",");
    setSelectedBlockCode(blocks);

    setDynamicForm(true);
    console.log("Selected categories:", selected);
  };
  const handleCenterChange = (selected: string[], code: string[]) => {};
  useEffect(() => {
    const fetchData = async () => {

      try {
        const object={
         
          "fieldName": "states",
          
        }
        const response = await getStateBlockDistrictList(object);
        const result = response?.result;
        SetStates(result);
        console.log(typeof states);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (!open) {
      setSelectedBlock([]);
      setSelectedDistrict([]);
      setSelectedState([]);
      setSelectedCenter([]);
      setDynamicForm(false);
    }
  }, [onClose, open]);

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
          tenantId: "ef99949b-7f3a-4a5f-806a-e67e683e38f3",
          roleId: RoleId.STUDENT,
          cohortId: [cohortId],
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
    try {
      const response = await createUser(apiBody);
      onClose();
      showToastMessage(t("LEARNERS.LEARNER_CREATED_SUCCESSFULLY"), "success");
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
            marginLeft:"50%"
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
              allCenters={centers}
              selectedCenter={selectedCenter}
              handleCenterChangeWrapper={handleCenterChangeWrapper}
            />
          </Box>
        </>
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
          >
            {/* <CustomSubmitButton onClose={primaryActionHandler} /> */}
          </DynamicForm>
        )}
      </SimpleModal>
    </>
  );
};

export default AddLearnerModal;
