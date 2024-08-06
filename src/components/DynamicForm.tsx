import { IChangeEvent, withTheme } from "@rjsf/core";
import { Theme as MaterialUITheme } from "@rjsf/mui";
import { RJSFSchema, RegistryFieldsType, WidgetProps } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { useTranslation } from "next-i18next";
import React, { ReactNode, useState } from "react";
import CustomRadioWidget from "./CustomRadioWidget";
import MultiSelectCheckboxes from "./MultiSelectCheckboxes";
import {
 
  Button, Box

} from "@mui/material";
const FormWithMaterialUI = withTheme(MaterialUITheme);

interface DynamicFormProps {
  schema: any;
  uiSchema: object;
  formData?: object;
  onSubmit: (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>,
  ) => void | Promise<void>;
  onChange: (event: IChangeEvent<any>) => void;
  onError: (errors: any) => void;
  showErrorList: boolean;

  widgets: {
    [key: string]: React.FC<WidgetProps<any, RJSFSchema, any>>;
  };
  customFields: {
    [key: string]: React.FC<RegistryFieldsType<any, RJSFSchema, any>>;
  };
  children?: ReactNode;
  buttonName?:string
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  uiSchema,
  formData,
  onSubmit,
  onChange,
  onError,
  customFields,
  children,
  buttonName
}) => {
  console.log(formData);
  const widgets: any = {
    MultiSelectCheckboxes: MultiSelectCheckboxes,
    CustomRadioWidget: CustomRadioWidget,
  };
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleError = (errors: any) => {
    console.log("handle error", errors);
    if (errors.length > 0) {
      const property = errors[0].property?.replace(/^root\./, "");
      const errorField = document.querySelector(
        `[name$="${property}"]`,
      ) as HTMLElement;

      if (errorField) {
        errorField.focus();
      } else {
        const fallbackField = document.getElementById(property) as HTMLElement;
        if (fallbackField) {
          fallbackField.focus();
        }
      }
    }
    onError(errors);
  };

  const handleSubmit = (event: IChangeEvent<any, RJSFSchema, any>, formEvent: React.FormEvent<any>) => {
    console.log("Submit button clicked");
    setSubmitted(true);
    onSubmit(event, formEvent);
  };

  const handleChange = (event: any) => {
    console.log("Form data changed:", event.formData);
    onChange(event);
  };

  const transformErrors = (errors: any) => {
    console.log("errors", errors);
    console.log("schema", schema);
    //if (!submitted) return [];

    return errors?.map((error: any) => {
      switch (error.name) {
        case "required": {
          console.log(submitted)
          error.message = submitted ? t("FORM_ERROR_MESSAGES.THIS_IS_REQUIRED_FIELD") : "";
          break;
        }
        case "maximum": {
          const property = error.property.substring(1);

          if (schema.properties?.[property]?.validation?.includes("numeric")) {
            error.message = t("FORM_ERROR_MESSAGES.MAX_LENGTH_DIGITS_ERROR", {
              maxLength: schema.properties?.[property]?.maxLength,
            });
          }
        }
        case "minimum": {
          const property = error.property.substring(1);
          if (schema.properties?.[property]?.validation?.includes("numeric")) {
            error.message = t("FORM_ERROR_MESSAGES.MIN_LENGTH_DIGITS_ERROR", {
              minLength: schema.properties?.[property]?.minLength,
            });
          }
        }
        case "pattern": {
          const pattern = error?.params?.pattern;
          console.log(pattern);
          const property = error.property.substring(1);

          switch (pattern) {
            case '^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$': {
              error.message = t(
                "FORM_ERROR_MESSAGES.NUMBER_AND_SPECIAL_CHARACTERS_NOT_ALLOWED",
              );
              break;
            }
            case "^[0-9]{10}$": {
              if (
                schema.properties?.[property]?.validation?.includes("mobile")
              ) {
                error.message = t(
                  "FORM_ERROR_MESSAGES.ENTER_VALID_MOBILE_NUMBER",
                );
              } else if (
                schema.properties?.[property]?.validation?.includes(".age")
              ) {
                error.message = t("age must be valid");
              } else {
                error.message = t(
                  "FORM_ERROR_MESSAGES.CHARACTERS_AND_SPECIAL_CHARACTERS_NOT_ALLOWED",
                );
              }
              break;
            }
            case "^d{10}$": {
              error.message = t(
                "FORM_ERROR_MESSAGES.CHARACTERS_AND_SPECIAL_CHARACTERS_NOT_ALLOWED",
              );
              break;
            }
          }
          break;
        }
        case "minLength": {
          const property = error.property.substring(1);
          if (schema.properties?.[property]?.validation?.includes("numeric")) {
            error.message = t("FORM_ERROR_MESSAGES.MIN_LENGTH_DIGITS_ERROR", {
              minLength: schema.properties?.[property]?.minLength,
            });
          }
          break;
        }
        case "maxLength": {
          const property = error.property.substring(1);
          if (schema.properties?.[property]?.validation?.includes("numeric")) {
            error.message = t("FORM_ERROR_MESSAGES.MAX_LENGTH_DIGITS_ERROR", {
              maxLength: schema.properties?.[property]?.maxLength,
            });
          }
          break;
        }
        case "format": {
          const format = error?.params?.format;
          switch (format) {
            case "email": {
              error.message = t("FORM_ERROR_MESSAGES.ENTER_VALID_EMAIL");
            }
          }
        }
      }

      return error;
    });
  };

  return (
    <div>
      <FormWithMaterialUI
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        validator={validator}
        liveValidate
        showErrorList={false}
        widgets={widgets}
        noHtml5Validate
        onError={handleError}
        transformErrors={transformErrors}
        fields={customFields}
      >
        {children}
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Button
            variant="contained"
            type="submit"
            onClick={() => {
              setSubmitted(true);
              console.log("Submit button was clicked");
            }}
            sx={{
              padding: '12px 24px', // Adjust padding as needed
              width: '200px', // Set the desired width
            }}
          >
           { buttonName}
          </Button>
        </Box>
      </FormWithMaterialUI>
    </div>
  );
};

export default DynamicForm;
