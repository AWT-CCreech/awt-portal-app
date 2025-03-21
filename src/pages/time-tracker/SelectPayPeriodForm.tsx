import React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

interface IProps {
  previousPeriod: boolean;
  setPreviousPeriod: (value: boolean) => void;
}

const SelectPayPeriodForm: React.FC<IProps> = ({
  previousPeriod,
  setPreviousPeriod,
}) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">
        Select pay period that you want to view:
      </FormLabel>
      <RadioGroup
        aria-label="pay-period"
        name="pay-period-group"
        value={previousPeriod ? 'last' : 'current'}
        onChange={() => setPreviousPeriod(!previousPeriod)}
      >
        <FormControlLabel
          value="current"
          control={<Radio />}
          label="Current Period"
        />
        <FormControlLabel
          value="last"
          control={<Radio />}
          label="Last Period"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default SelectPayPeriodForm;
