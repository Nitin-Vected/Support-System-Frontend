import React, { useState } from 'react';
import { FaQuestionCircle, FaTicketAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { Modal, Box, Typography } from '@mui/material';
import UserForm from './UserForm'; // Adjust the path if necessary

const Home: React.FC = () => {
  const location = useLocation();
  const userData = useSelector((state: RootState) => state.auth.userData);

  const displayUserData = {
    userName: userData?.name || location.state?.userData?.name || null,
    role: userData?.role || location.state?.userData?.role || 'Student',
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <section className="heading">
        {displayUserData.userName ? (
          <>
            <h1>Welcome back, {displayUserData.userName}!</h1>
            {displayUserData.role === 'Student' ? (
              <p>What do you need help with today?</p>
            ) : displayUserData.role === 'Admin' ? (
              <p>As an Admin, you can manage queries and assist users.</p>
            ) : (
              <p>Welcome! How can we assist you today?</p>
            )}
          </>
        ) : (
          <>
            <h1>Welcome to the Support Desk</h1>
            <p>Please log in to get started.</p>
          </>
        )}
      </section>

      {displayUserData.role === 'Admin' && (
        <>
          {/* Updated button to be at the top */}
          <button onClick={handleOpen} className="btn btn-reverse btn-block">
            Register New User
          </button>

          <Link to="/manage-queries" className="btn  btn-block">
            <FaTicketAlt /> Manage Queries
          </Link>
          <Link to="/user-management" className="btn btn-block">
            <FaQuestionCircle /> User Management
          </Link>
        </>
      )}

      {displayUserData.role === 'Student' && (
        <>
          <Link to="/new-query" className="btn btn-reverse btn-block">
            <FaQuestionCircle /> Create New Query
          </Link>
          <Link to="/queries" className="btn btn-block">
            <FaTicketAlt /> View Your Queries
          </Link>
        </>
      )}

      {/* Modal for Registration Form */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <center>
          <Typography id="modal-title" variant="h6" component="h2">
            Register User
          </Typography>

          </center>
          <UserForm onClose={handleClose} />
        </Box>
      </Modal>
    </>
  );
};

export default Home;
