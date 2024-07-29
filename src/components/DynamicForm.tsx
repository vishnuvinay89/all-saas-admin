import { IChangeEvent, withTheme } from '@rjsf/core';
import { Theme as MaterialUITheme } from '@rjsf/mui';
import { RJSFSchema, RegistryFieldsType, WidgetProps } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { useTranslation } from 'next-i18next';
import React, { ReactNode } from 'react';
import CustomRadioWidget from './CustomRadioWidget';
import MultiSelectCheckboxes from './MultiSelectCheckboxes';

const FormWithMaterialUI = withTheme(MaterialUITheme);

interface DynamicFormProps {
  schema: any;
  uiSchema: object;
  formData?: object;
  onSubmit: (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
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
}) => {
  const widgets = {
    MultiSelectCheckboxes: MultiSelectCheckboxes,
    CustomRadioWidget: CustomRadioWidget,
  };
  const { t } = useTranslation();

  const handleError = (errors: any) => {
    if (errors.length > 0) {
      const property = errors[0].property?.replace(/^root\./, '');
      const errorField = document.querySelector(
        `[name$="${property}"]`
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

  function transformErrors(errors: any) {
    console.log('errors', errors);
    console.log('schema', schema);
    return errors.map((error: any) => {
      switch (error.name) {
        case 'required': {
          error.message = t('FORM_ERROR_MESSAGES.THIS_IS_REQUIRED_FIELD');
          break;
        }
        case 'pattern': {
          const property = error.property.substring(1);
          if (schema.properties?.[property]?.validation?.includes('numeric')) {
            error.message = t('FORM_ERROR_MESSAGES.ENTER_ONLY_DIGITS');
          } else if (
            schema.properties?.[property]?.validation?.includes(
              'characters-with-space'
            )
          ) {
            error.message = t(
              'FORM_ERROR_MESSAGES.NUMBER_AND_SPECIAL_CHARACTERS_NOT_ALLOWED'
            );
          }
          break;
        }
        case 'minLength': {
          const property = error.property.substring(1);
          if (schema.properties?.[property]?.validation?.includes('numeric')) {
            error.message = t('FORM_ERROR_MESSAGES.MIN_LENGTH_DIGITS_ERROR', {
              minLength: schema.properties?.[property]?.minLength,
            });
          }
          break;
        }
        case 'maxLength': {
          const property = error.property.substring(1);
          if (schema.properties?.[property]?.validation?.includes('numeric')) {
            error.message = t('FORM_ERROR_MESSAGES.MAX_LENGTH_DIGITS_ERROR', {
              maxLength: schema.properties?.[property]?.maxLength,
            });
          }
          break;
        }
      }

      return error;
    });
  }

  function handleChange(event: any) {
    console.log('Form data event:', event);
    onChange(event);
  }

  const customValidate = (formData: any, errors: any) => {
    if (formData.name && /\d/.test(formData.name)) {
      errors.name.addError(t('FORM_ERROR_MESSAGES.NAME_CANNOT_INCLUDE_DIGITS'));
    }

    if (formData.father_name && /\d/.test(formData.father_name)) {
      errors.father_name.addError(t('FORM_ERROR_MESSAGES.NAME_CANNOT_INCLUDE_DIGITS'));
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      errors.email.addError(t('FORM_ERROR_MESSAGES.INVALID_EMAIL_FORMAT'));
    }

    return errors;
  };

  return (
    <div>
      <FormWithMaterialUI
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onChange={handleChange}
        onSubmit={onSubmit}
        validator={validator}
        liveValidate
        showErrorList={false}
        widgets={widgets}
        noHtml5Validate
        onError={handleError}
        transformErrors={transformErrors}
        fields={customFields}
        customValidate={customValidate} // Add customValidate function here
      >
        {children}
      </FormWithMaterialUI>
    </div>
  );
};

export default DynamicForm;