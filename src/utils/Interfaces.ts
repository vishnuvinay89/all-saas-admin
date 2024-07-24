

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  name: string;
  type: 'text' | 'numeric' | 'drop_down' | 'checkbox' | 'radio' | 'email';
  label: string;
  order: string;
  coreField: number;
  dependsOn: string | boolean | null;
  isEditable: boolean;
  isPIIField: boolean | null;
  validation?: string[];
  placeholder: string;
  isMultiSelect: boolean;
  maxSelections: number | null;
  sourceDetails: Record<string, any>;
  options: FieldOption[];
  hint?: string | null;
  pattern?: string | null;
  maxLength?: number | null;
  minLength?: number | null;
  fieldId: string;
  required?: boolean;
}
export interface TenantCohortRoleMapping {
  tenantId: string;
  roleId: string;
}

export interface CustomField {
  fieldId: string;
  value: string;
}
export interface FormData {
  formid: string;
  title: string;
  fields: Field[];
}
export interface createUserParam {
  username: string;
  name: string;
  email: string;
  password: string;
  tenantCohortRoleMapping: TenantCohortRoleMapping[];
  customFields: CustomField[];
}


