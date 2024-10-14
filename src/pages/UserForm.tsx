import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent for type
import { registerUser } from '../utility/utility';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { toast } from 'react-toastify'; // Import toast

const UserForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const token = useSelector((state: RootState) => state.auth.userData?.token || ''); // Fetch token from Redux store
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        role: 'SupportAdmin',
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateFormData = () => {
        const { name, email, contactNumber } = formData;
        if (!name.trim()) {
            toast.error("Name is required!");
            return false;
        }
        if (!email.trim()) {
            toast.error("Email is required!");
            return false;
        }
        if (!contactNumber.trim()) {
            toast.error("Contact Number is required!");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validate form data before submitting
        if (!validateFormData()) return;

        try {
            console.log("FormData ===> ", formData);
            const { data } = await registerUser(formData, token);
            console.log('User registered:', data);

            // Close the modal first
            onClose();

            // Show success toast after closing the modal
            toast.success("User registered successfully!");

            // Reset form data
            setFormData({
                name: '',
                email: '',
                contactNumber: '',
                role: 'SupportAdmin',
            });
        } catch (error) {
            console.error('There was an error registering the user!', error);

            // Close the modal first
            onClose();

            // Show error toast after closing the modal
            toast.error("Failed to register user. Please try again.");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
            />
            <FormControl fullWidth sx={{ mb: 4, mt: 2 }}>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                    labelId="role-select-label"
                    id="role-select"
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleSelectChange}
                >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Counsellor">Counsellor</MenuItem>
                    <MenuItem value="Student">Student</MenuItem>
                </Select>
            </FormControl>
            <button type="submit"className="btn btn-block">
                Register
            </button>

        </Box>
    );
};

export default UserForm;
