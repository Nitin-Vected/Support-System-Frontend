import React, { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import Spinner from "../components/Spinner";
import { adminGetUserList, adminUpdateStudentStatus } from "../utility/utility";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    email: string;
    role: string;
    currentStatus: boolean;
  } | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("All"); // For filtering by role

  const token = useSelector(
    (state: RootState) => state.auth.userData?.token || ""
  );

  // Fetch the student list when the component mounts
  useEffect(() => {
    const getStudents = async () => {
      setLoading(true);
      try {
        const response = await adminGetUserList(token);
        setStudents(response.data.userList);
        setFilteredStudents(response.data.userList); // Set the full list initially
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students");
        toast.error("Error fetching students"); // Show error notification
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, [token]);

  // Filter students based on selected role
  useEffect(() => {
    if (roleFilter === "All") {
      setFilteredStudents(students); // Show all students
    } else {
      setFilteredStudents(
        students.filter((student) => student.role === roleFilter)
      );
    }
  }, [roleFilter, students]);

  // Open modal for confirming status change
  const handleOpenModal = (email: string, role: string, currentStatus: boolean) => {
    setSelectedStudent({ email, role, currentStatus });
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null); // Reset the selected student
  };

  // Handle status change confirmation
  const handleConfirmStatusChange = async () => {
    if (!selectedStudent) return;

    const { email, role, currentStatus } = selectedStudent;
    const newStatus = !currentStatus; // Toggle the current status

    setLoading(true);
    try {
      const response = await adminUpdateStudentStatus(email, role, newStatus, token);

      // Update the student's status in the list if successful
      setStudents(
        students.map((student) =>
          student.email === email ? { ...student, isActive: newStatus } : student
        )
      );
      toast.success("User status updated successfully");
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        toast.error("Admin Status Cannot be updated");
      } else {
        console.error("Error updating student status:", error.message);
        setError("Failed to update student status");
        toast.error("Error updating user status");
      }
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 250, flex: 1 },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "isActive",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.row.isActive ? "success" : "error"}
          onClick={() => handleOpenModal(params.row.email, params.row.role, params.row.isActive)}
        >
          {params.row.isActive ? "Active" : "Inactive"}
        </Button>
      ),
    },
  ];

  // Dynamic heading based on roleFilter
  const getHeading = () => {
    switch (roleFilter) {
      case "Admin":
        return "Admin Users";
      case "Counsellor":
        return "Counsellor Users";
      case "Student":
        return "Student Users";
      default:
        return "All Users";
    }
  };

  if (loading) {
    return <Spinner />;
  }
  if (error) return <div>{error}</div>;

  return (
    <>
      <BackButton url="/" />
      <h1 style={{ fontSize: "3rem" }}>{getHeading()}</h1>

      {/* Filter by Role */}
      <Grid container justifyContent="flex-end" alignItems="center">
        <FormControl style={{ marginBottom: "16px", minWidth: 150 }}>
          <InputLabel>Filter by Role</InputLabel>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as string)}
            label="Filter by Role"
          >
            <MenuItem value="All">All Users</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Counsellor">Counsellor</MenuItem>
            <MenuItem value="Student">Student</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <div style={{ height: 400, width: "100%" }}>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <DataGrid
            rows={filteredStudents.map((student, index) => ({
              id: index,
              name: student.name,
              email: student.email,
              contactNumber: student.contactNumber || "-",
              role: student.role,
              isActive: student.isActive,
            }))}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            disableRowSelectionOnClick
          />
        </div>
      </div>

      {/* Modal for confirming status change */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="confirm-status-change"
      >
        <DialogTitle id="confirm-status-change">
          Confirm Status Change
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change this user's status?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmStatusChange} color="error">
            Yes, Change Status
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserManagement;