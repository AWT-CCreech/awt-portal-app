import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Modules from '../../app/api/agent';
import { DailyGoalDetail } from '../../models/DailyGoalsReport/DailyGoalDetail';

interface DailyGoalsDetailProps {
    displayType?: string;
    searchDate?: string;
}

const DailyGoalsDetail: React.FC<DailyGoalsDetailProps> = ({
    displayType: propDisplayType,
    searchDate: propSearchDate,
}) => {
    const [searchParams] = useSearchParams();
    // Use props if provided; otherwise fallback to query parameters.
    const displayType = propDisplayType || searchParams.get('DisplayType') || '';
    const searchDate = propSearchDate || searchParams.get('SearchDate') || '';
    const [details, setDetails] = useState<DailyGoalDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (displayType && searchDate) {
            setLoading(true);
            Modules.DailyGoals.getDetail({ DisplayType: displayType, SearchDate: searchDate })
                .then((data) => {
                    setDetails(data);
                })
                .catch((err) => {
                    console.error('Error fetching details:', err);
                    setError('Error fetching detail records.');
                })
                .finally(() => setLoading(false));
        }
    }, [displayType, searchDate]);

    // Calculate totals for the footer row
    const totalQuote = details.reduce((acc, curr) => acc + curr.quoteTotal, 0);
    let totalInvoice = 0;
    let totalConsign = 0;
    if (displayType.toLowerCase() === 'shipped') {
        totalInvoice = details.reduce((acc, curr) => acc + (curr.invoiceCost || 0), 0);
        totalConsign = details.reduce((acc, curr) => acc + (curr.consignCost || 0), 0);
    }
    let gpPercent = 0;
    if (displayType.toLowerCase() === 'shipped' && totalQuote !== 0) {
        gpPercent = (totalQuote - (totalInvoice + totalConsign)) / totalQuote;
    }

    return (
        <Container sx={{ marginTop: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
                {displayType} for {searchDate}
            </Typography>
            {loading && (
                <Typography>
                    <CircularProgress size={24} /> Loading...
                </Typography>
            )}
            {error && <Typography color="error">{error}</Typography>}
            {!loading && !error && (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ width: '10%' }}>
                                    {(displayType.toLowerCase() === 'sold' ||
                                        displayType.toLowerCase() === 'unshipped')
                                        ? 'SO #'
                                        : 'Inv #'}
                                </TableCell>
                                <TableCell sx={{ width: '46%' }}>Company</TableCell>
                                <TableCell align="right" sx={{ width: '12%' }}>
                                    Inv Total
                                </TableCell>
                                {displayType.toLowerCase() === 'shipped' && (
                                    <>
                                        <TableCell align="right" sx={{ width: '12%' }}>
                                            Inv Cost
                                        </TableCell>
                                        <TableCell align="right" sx={{ width: '12%' }}>
                                            Consign Cost
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {details.map((detail, index) => (
                                <TableRow key={index} hover>
                                    <TableCell align="center">{detail.orderNum}</TableCell>
                                    <TableCell>{detail.customerName}</TableCell>
                                    <TableCell align="right">
                                        {detail.quoteTotal.toLocaleString(undefined, {
                                            style: 'currency',
                                            currency: 'USD',
                                        })}
                                    </TableCell>
                                    {displayType.toLowerCase() === 'shipped' && (
                                        <>
                                            <TableCell align="right">
                                                {(detail.invoiceCost || 0).toLocaleString(undefined, {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                })}
                                            </TableCell>
                                            <TableCell align="right">
                                                {(detail.consignCost || 0).toLocaleString(undefined, {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                })}
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                            {/* Totals Row */}
                            <TableRow>
                                <TableCell colSpan={2} align="right">
                                    <strong>Totals:</strong>
                                </TableCell>
                                <TableCell align="right">
                                    <strong>
                                        {totalQuote.toLocaleString(undefined, {
                                            style: 'currency',
                                            currency: 'USD',
                                        })}
                                    </strong>
                                </TableCell>
                                {displayType.toLowerCase() === 'shipped' && (
                                    <>
                                        <TableCell align="right">
                                            <strong>
                                                {totalInvoice.toLocaleString(undefined, {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                })}
                                            </strong>
                                        </TableCell>
                                        <TableCell align="right">
                                            <strong>
                                                {totalConsign.toLocaleString(undefined, {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                })}
                                            </strong>
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                            {/* GP % Row for shipped details */}
                            {displayType.toLowerCase() === 'shipped' && (
                                <TableRow>
                                    <TableCell colSpan={2} align="right">
                                        <strong>GP %:</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                        <strong>{(gpPercent * 100).toFixed(2)}%</strong>
                                    </TableCell>
                                    <TableCell colSpan={2} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default DailyGoalsDetail;
