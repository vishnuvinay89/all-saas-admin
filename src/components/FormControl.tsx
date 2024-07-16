import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface MultipleSelectCheckmarksProps {
  names: string[];
  codes: string[];
  tagName: string;
  selectedCategories: string[];
  onCategoryChange: (selectedNames: string[], selectedCodes: string[]) => void;
  disabled?: boolean;
}

const MultipleSelectCheckmarks: React.FC<MultipleSelectCheckmarksProps> = ({ names, codes, tagName, selectedCategories, onCategoryChange, disabled = false }) => {
  const handleChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
    const {
      target: { value },
    } = event;
    const selectedNames = typeof value === 'string' ? value.split(',') : value;
    const selectedCodes = selectedNames.map(name => codes[names.indexOf(name)]);
    onCategoryChange(selectedNames, selectedCodes);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }} disabled={disabled}>
        <InputLabel id="multiple-checkbox-label">{tagName}</InputLabel>
        <Select
          labelId="multiple-checkbox-label"
          id="multiple-checkbox"
          multiple
          value={selectedCategories}
          onChange={handleChange}
          input={<OutlinedInput label={tagName} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={selectedCategories.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultipleSelectCheckmarks;
