import React from 'react';
import { Box, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

interface SharedDateRangePickerProps {
    value: DateRange;
    onChange: (newRange: DateRange) => void;
    startLabel?: string;
    endLabel?: string;
}

export default function SharedDateRangePicker({
    value,
    onChange,
    startLabel = 'Start Date',
    endLabel = 'End Date',
}: SharedDateRangePickerProps) {
    const sd = dayjs(value.startDate);
    const ed = dayjs(value.endDate);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <DatePicker
                    label={startLabel}
                    value={sd}
                    onChange={(newVal: Dayjs | null) => {
                        if (newVal) {
                            onChange({ startDate: newVal.toDate(), endDate: value.endDate });
                        }
                    }}
                    slotProps={{
                        textField: { fullWidth: true }
                    }}
                />

                <DatePicker
                    label={endLabel}
                    value={ed}
                    onChange={(newVal: Dayjs | null) => {
                        if (newVal) {
                            onChange({ startDate: value.startDate, endDate: newVal.toDate() });
                        }
                    }}
                    slotProps={{
                        textField: { fullWidth: true }
                    }}
                />
            </Box>
        </LocalizationProvider>
    );
}