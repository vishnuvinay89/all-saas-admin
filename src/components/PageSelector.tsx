import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";
import { useTranslation } from "next-i18next";

const PageSizeSelector = ({ handleChange, pageSize, options }: any) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="page-size-selector-label">Page Size</InputLabel>
      <Select
        labelId="page-size-selector-label"
        id="page-size-selector"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={pageSize}
        label={t("COMMON.PAGE_SIZE")}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options?.map((option: any) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PageSizeSelector;
