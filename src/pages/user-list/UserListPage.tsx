import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
  Paper,
  TableCell,
  TableRow,
} from '@mui/material';
import { Add, Delete, GetApp } from '@mui/icons-material';
import Modules from '../../app/api/agent';
import PageHeader from '../../components/PageHeader';
import PaginatedSortableTable from '../../components/PaginatedSortableTable';
import { User } from '../../models/User';
import { ROUTE_PATHS } from '../../routes';

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    uid: number | null;
  }>({ open: false, uid: null });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await Modules.UserList.fetchUserList();
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
      const addedUser = await Modules.UserList.addUser(selectedUser as User);
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

  const handleUpdateUser = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (selectedUser.id) {
        const updated = await Modules.UserList.updateUser(
          selectedUser.id,
          selectedUser as User
        );
        setUsers(
          users.map((user) => (user.id === updated.id ? updated : user))
        );
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
      await Modules.UserList.deleteUser(uid);
      setUsers(users.filter((user) => user.id !== uid));
      setSuccess('Deleted user successfully!');
    } catch (err) {
      setError('Failed to delete user');
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

  const handleExportExcel = async () => {
    // Excel export logic
  };

  const handleRowRendering = useCallback(
    (user: User): React.JSX.Element => (
      <TableRow
        key={user.id}
        hover
        onClick={() => handleRowClick(user)}
        style={{ cursor: 'pointer' }}
      >
        <TableCell>{user.lname}</TableCell>
        <TableCell>{user.fname}</TableCell>
        <TableCell>{user.uname}</TableCell>
        <TableCell align="left">{user.extension}</TableCell>
        <TableCell align="left">{user.directPhone}</TableCell>
        <TableCell align="left">{user.mobilePhone}</TableCell>
        <TableCell align="right">
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
    ),
    [handleRowClick, setConfirmDelete]
  );

  const columnNames = [
    'Last Name',
    'First Name',
    'Username',
    'Extension',
    'Direct Phone',
    'Mobile Phone',
    '',
  ];

  return (
    <div>
      <PageHeader pageName="User List" pageHref={ROUTE_PATHS.USER_LIST} />
      <Paper className="padded user-table-paper">
        <div className="header-container">
          <Typography variant="h5">AWT User List</Typography>
          <div>
            <Tooltip title="Add User">
              <IconButton
                color="primary"
                onClick={handleOpenAddUserModal}
                className="button-margin-right"
              >
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
        {error && (
          <Snackbar open autoHideDuration={3000}>
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        )}
        {success && (
          <Snackbar open autoHideDuration={3000}>
            <Alert severity="success">{success}</Alert>
          </Snackbar>
        )}
        {loading && <CircularProgress />}
        {!loading && (
          <PaginatedSortableTable
            tableData={users}
            func={handleRowRendering}
            columns={[
              'lname',
              'fname',
              'uname',
              'extension',
              'directPhone',
              'mobilePhone',
              '',
            ]}
            columnNames={columnNames}
            headerBackgroundColor="#384959"
            hoverColor="#f5f5f5"
          />
        )}
      </Paper>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
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

      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, uid: null })}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            {users.find((user) => user.id === confirmDelete.uid)?.uname}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, uid: null })}>
            No
          </Button>
          <Button onClick={handleConfirmDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserListPage;
