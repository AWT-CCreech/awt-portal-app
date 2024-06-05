import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface IProps {
  previousPeriod: boolean;
  setPreviousPeriod: (value: boolean) => void;
}

const SelectPayPeriodForm: React.FC<IProps> = ({ previousPeriod, setPreviousPeriod }) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Select pay period that you want to view:</FormLabel>
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
