import React, { useEffect, useState, useRef } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
  Snackbar, Alert, CircularProgress, Button, IconButton, Tooltip, Typography, Divider, TableSortLabel 
} from '@mui/material';
import { Add, Delete, GetApp } from '@mui/icons-material';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../app/api/agent';
import { User } from '../../models/UserList/User';
import PageHeader from '../../sharedComponents/PageHeader';
import * as XLSX from 'xlsx';
import './style/UserListPage.css';

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<keyof User>('lname');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean, uid: number | null }>({ open: false, uid: null });

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleAddUser = async () => {
    setLoading(true);
    setError(null);  
    setSuccess(null);
    try {
      const addedUser = await addUser(selectedUser as User);
      setUsers([...users, addedUser]);
      setModalOpen(false);
      setSelectedUser({});
      setSuccess(`${selectedUser.uname} added successfully!`);
    } catch (err) {
      setError(`Failed to add user: ${selectedUser.uname}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'UserList.xlsx');
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    setError(null);  
    setSuccess(null);
    try {
      if (selectedUser.id) {
        const updated = await updateUser(selectedUser.id, selectedUser as User);
        setUsers(users.map(user => (user.id === updated.id ? updated : user)));
        setModalOpen(false);
        setSelectedUser({});
        setSuccess(`${selectedUser.uname} updated!`);
      }
    } catch (err) {
      setError(`Failed to update: ${selectedUser.uname}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid: number) => {
    setLoading(true);
    setError(null);  
    setSuccess(null);
    try {
      await deleteUser(uid);
      setUsers(users.filter(user => user.id !== uid));
      setSuccess(`Deleted ${userToDelete?.uname}!`);
    } catch (err) {
      setError(`Failed to delete: ${uid}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete.uid !== null) {
      await handleDeleteUser(confirmDelete.uid);
      setConfirmDelete({ open: false, uid: null });
    }
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsUpdate(true);
    setModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleOpenAddUserModal = () => {
    setSelectedUser({});
    setIsUpdate(false);
    setModalOpen(true);
  };

  const handleSort = (clickedColumn: keyof User) => {
    if (sortColumn !== clickedColumn) {
      setSortColumn(clickedColumn);
      setSortDirection('asc');
    } else {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
    if (bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const userToDelete = confirmDelete.uid !== null ? users.find(user => user.id === confirmDelete.uid) : null;

  return (
    <div>
      <PageHeader pageName="User List" pageHref="/userlist" />
      <Divider />
      <Paper className="padded user-table-paper">
        <div className="header-container">
          <Typography variant="h5">AWT User List</Typography>
          <div>
            <Tooltip title="Add User">
              <IconButton color="primary" onClick={handleOpenAddUserModal} className="button-margin-right">
                <Add />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export to Excel">
              <IconButton color="success" onClick={handleExportExcel}>
                <GetApp />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        {error && <Snackbar open autoHideDuration={3000}><Alert severity="error">{error}</Alert></Snackbar>}
        {success && <Snackbar open autoHideDuration={3000}><Alert severity="success">{success}</Alert></Snackbar>}
        {loading && <CircularProgress />}
        {!loading && (
          <div className="table-wrapper" ref={tableRef}>
            <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sortDirection={sortColumn === 'lname' ? sortDirection : false}>
                      <TableSortLabel
                        active={sortColumn === 'lname'}
                        direction={sortColumn === 'lname' ? sortDirection : 'asc'}
                        onClick={() => handleSort('lname')}
                      >
                        Last
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={sortColumn === 'fname' ? sortDirection : false}>
                      <TableSortLabel
                        active={sortColumn === 'fname'}
                        direction={sortColumn === 'fname' ? sortDirection : 'asc'}
                        onClick={() => handleSort('fname')}
                      >
                        First
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={sortColumn === 'uname' ? sortDirection : false}>
                      <TableSortLabel
                        active={sortColumn === 'uname'}
                        direction={sortColumn === 'uname' ? sortDirection : 'asc'}
                        onClick={() => handleSort('uname')}
                      >
                        Username
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" sortDirection={sortColumn === 'extension' ? sortDirection : false}>
                      <TableSortLabel
                        active={sortColumn === 'extension'}
                        direction={sortColumn === 'extension' ? sortDirection : 'asc'}
                        onClick={() => handleSort('extension')}
                      >
                        Ext
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" sortDirection={sortColumn === 'directPhone' ? sortDirection : false}>
                      <TableSortLabel
                        active={sortColumn === 'directPhone'}
                        direction={sortColumn === 'directPhone' ? sortDirection : 'asc'}
                        onClick={() => handleSort('directPhone')}
                      >
                        Direct
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" sortDirection={sortColumn === 'mobilePhone' ? sortDirection : false}>
                      <TableSortLabel
                        active={sortColumn === 'mobilePhone'}
                        direction={sortColumn === 'mobilePhone' ? sortDirection : 'asc'}
                        onClick={() => handleSort('mobilePhone')}
                      >
                        Cell
                      </TableSortLabel>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedUsers.map(user => (
                    <TableRow key={user.id} onClick={() => handleRowClick(user)} hover>
                      <TableCell>{user.lname}</TableCell>
                      <TableCell>{user.fname}</TableCell>
                      <TableCell>{user.uname}</TableCell>
                      <TableCell align="right">{user.extension}</TableCell>
                      <TableCell align="right">{user.directPhone}</TableCell>
                      <TableCell align="right">{user.mobilePhone}</TableCell>
                      <TableCell>
                        <Tooltip title="Delete User">
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete({ open: true, uid: user.id });
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{isUpdate ? 'Update User' : 'Add User'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="First Name"
              name="fname"
              value={selectedUser.fname || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Middle Name"
              name="mname"
              value={selectedUser.mname || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Last Name"
              name="lname"
              value={selectedUser.lname || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Job Title"
              name="jobTitle"
              value={selectedUser.jobTitle || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Extension"
              name="extension"
              value={selectedUser.extension || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Direct Phone"
              name="directPhone"
              value={selectedUser.directPhone || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Mobile Phone"
              name="mobilePhone"
              value={selectedUser.mobilePhone || ''}
              onChange={handleInputChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={isUpdate ? handleUpdateUser : handleAddUser}>
              {isUpdate ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, uid: null })}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete {userToDelete ? userToDelete.uname : 'this user'}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete({ open: false, uid: null })}>No</Button>
            <Button onClick={handleConfirmDelete}>Yes</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
};

export default UserListPage;
