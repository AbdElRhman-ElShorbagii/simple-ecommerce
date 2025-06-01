import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CssBaseline,
  Alert,
} from '@mui/material';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom'; // ✅ Import this

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // ✅ Setup navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await loginUser(form);
      const { token,user } = response.data.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user)); // include name in this object

      setSuccess('Login successful!');

      // ✅ Redirect to home after short delay (optional)
      setTimeout(() => {
        navigate('/'); // redirect to home
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white',
          marginTop: '20vh',
        }}
      >
        <Typography component="h1" variant="h5">Welcome back</Typography>
        <Typography variant="body2" color="text.secondary" align="center" marginBottom={2}>
          Please enter your details to sign in
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%' }}>{success}</Alert>}

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Enter your email"
          name="email"
          autoComplete="email"
          autoFocus
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Enter your password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
