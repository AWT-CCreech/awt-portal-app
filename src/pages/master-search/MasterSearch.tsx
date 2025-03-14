// React and Hooks
import React, { useState } from 'react';

// Components
import PageHeader from '../../shared/components/PageHeader';
import { ROUTE_PATHS } from '../../routes';
import BuyOppsEvent from './BuyOppsEvent';
import SellOppsEvent from './SellOppsEvent';
import SellOppsDetail from './SellOppsDetail';
import BuyOppsDetail from './BuyOppsDetail';
import SearchBox from './SearchBox';
import ContactSearch from './ContactSearch';

// API
import agent from '../../app/api/agent';

// MUI Components
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid2';

interface IProps { }

const MasterSearch: React.FC<IProps> = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchFor, setSearchFor] = useState(1);
  const [viewBy, setViewBy] = useState('event');
  const [chkID, setChkID] = useState(true);
  const [chkSONo, setChkSONo] = useState(false);
  const [chkPartNo, setChkPartNo] = useState(false);
  const [chkPartDesc, setChkPartDesc] = useState(false);
  const [chkPONo, setChkPONo] = useState(false);
  const [chkMfg, setChkMfg] = useState(false);
  const [chkCompany, setChkCompany] = useState(false);
  const [chkInvNo, setChkInvNo] = useState(false);
  const [chkActive, setChkActive] = useState(true);

  const [searchResult, setSearchResult] = useState<JSX.Element[]>([]);

  const getResultSets = async (): Promise<void> => {
    if (searchValue.trim() === '') {
      alert('You cannot leave Search box blank. Please try again.');
      return;
    }
    if (
      searchFor !== 4 &&
      !chkID &&
      !chkSONo &&
      !chkPartNo &&
      !chkPartDesc &&
      !chkPONo &&
      !chkMfg &&
      !chkCompany &&
      !chkInvNo
    ) {
      alert(
        'You must select at least one of the options: ID, Part No, Part Desc, Company, SO No, PO No, Mfg, or Inv No.'
      );
      return;
    }

    const searchObject = {
      Search: searchValue,
      ID: chkID,
      SONo: chkSONo,
      PartNo: chkPartNo,
      PartDesc: chkPartDesc,
      PONo: chkPONo,
      Mfg: chkMfg,
      Company: chkCompany,
      InvNo: chkInvNo,
      Uname: localStorage.getItem('username'),
    };

    let tempSearchResult: React.JSX.Element[] = [];

    if (viewBy === 'event') {
      if (searchFor === 1 || searchFor === 3) {
        const response1 =
          await agent.MasterSearches.getSellOppEvents(searchObject);
        tempSearchResult = [
          ...tempSearchResult,
          <SellOppsEvent sellOppEvents={response1} key="sellOppsEvent" />,
        ];
      }
      if (searchFor === 2 || searchFor === 3) {
        const response2 =
          await agent.MasterSearches.getBuyOppEvents(searchObject);
        tempSearchResult = [
          ...tempSearchResult,
          <BuyOppsEvent
            buyOppEvents={response2}
            partJumpTo={chkPartNo ? searchValue : ''}
            key="buyOppsEvent"
          />,
        ];
      }
    } else if (viewBy === 'detail') {
      if (searchFor === 1 || searchFor === 3) {
        const response3 =
          await agent.MasterSearches.getSellOppDetails(searchObject);
        tempSearchResult = [
          ...tempSearchResult,
          <SellOppsDetail sellOppDetails={response3} key="sellOppsDetail" />,
        ];
      }
      if (searchFor === 2 || searchFor === 3) {
        const response4 =
          await agent.MasterSearches.getBuyOppDetails(searchObject);
        tempSearchResult = [
          ...tempSearchResult,
          <BuyOppsDetail
            buyOppDetails={response4}
            partJumpTo={chkPartNo ? searchValue : ''}
            key="buyOppsDetail"
          />,
        ];
      }
    }

    if (searchFor === 4) {
      const response5 = await agent.MasterSearches.getContacts(
        searchValue,
        chkActive
      );
      tempSearchResult = [
        ...tempSearchResult,
        <ContactSearch contacts={response5} key="contactSearch" />,
      ];
    }
    setSearchResult(tempSearchResult);
  };

  return (
    <div>
      <PageHeader pageName="Master Search" pageHref={ROUTE_PATHS.MASTER_SEARCH} />
      <Container maxWidth={false} sx={{ padding: { xs: '20px', md: '20px' } }}>
        <Grid2 container justifyContent="center">
          <Grid2 size={{ xs: 12 }}>
            <SearchBox
              searchValue={searchValue}
              searchFor={searchFor}
              viewBy={viewBy}
              chkID={chkID}
              chkSONo={chkSONo}
              chkPartNo={chkPartNo}
              chkPartDesc={chkPartDesc}
              chkPONo={chkPONo}
              chkMfg={chkMfg}
              chkCompany={chkCompany}
              chkInvNo={chkInvNo}
              chkActive={chkActive}
              setSearchValue={setSearchValue}
              setSearchFor={setSearchFor}
              setViewBy={setViewBy}
              setChkID={setChkID}
              setChkSONo={setChkSONo}
              setChkPartNo={setChkPartNo}
              setChkPartDesc={setChkPartDesc}
              setChkPONo={setChkPONo}
              setChkMfg={setChkMfg}
              setChkCompany={setChkCompany}
              setChkInvNo={setChkInvNo}
              setChkActive={setChkActive}
              getResultSets={getResultSets}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            {searchResult}
          </Grid2>
        </Grid2>
      </Container>
    </div>
  );
};

export default MasterSearch;
