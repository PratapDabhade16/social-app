import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Link,
  InputAdornment, IconButton, Divider, Card, Avatar
} from '@mui/material';
import {
  Visibility, VisibilityOff, Favorite, ChatBubbleOutlineOutlined
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token',    data.token);
      localStorage.setItem('username', data.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#fff' }}>
      {/* Left Visual Panel - Hidden on Mobile */}
      <Box sx={{
        flex: 1.2,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
        position: 'relative',
        overflow: 'hidden',
        px: 6,
        color: '#fff'
      }}>
        {/* Soft Animated Decorative Circles */}
        <Box sx={{
          position: 'absolute', top: '-10%', left: '-10%',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />
        <Box sx={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'rgba(219, 39, 119, 0.15)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }} />

        <Box sx={{ maxWidth: 480, textAlign: 'center', zIndex: 2 }}>
          <Typography variant="h3" sx={{
            fontWeight: 800,
            mb: 2,
            letterSpacing: '-1.5px',
            lineHeight: 1.2,
            textShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            Share the moments that matter.
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 6, fontSize: '1.1rem', fontWeight: 500 }}>
            Connect with friends, discover stories, and be part of a friendly, real-time social community.
          </Typography>

          {/* Interactive Mock Post Card */}
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 5,
            p: 3,
            textAlign: 'left',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            transform: 'rotate(-1.5deg)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.02) rotate(0deg)' }
          }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{
                background: 'linear-gradient(135deg, #34d399, #059669)',
                width: 44, height: 44, fontWeight: 'bold'
              }}>S</Avatar>
              <Box>
                <Typography fontWeight="700" fontSize={15} color="#fff">Sarah Jenkins</Typography>
                <Typography fontSize={12} color="rgba(255,255,255,0.7)">@sarahj · 2m ago</Typography>
              </Box>
            </Box>
            <Typography fontSize={14.5} color="rgba(255,255,255,0.95)" lineHeight={1.6} mb={2.5}>
              Just launched the new frontend design! The micro-animations and typography updates make the app feel incredibly alive and human. 🚀✨
            </Typography>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 2 }} />
            <Box display="flex" gap={3} color="rgba(255,255,255,0.8)">
              <Box display="flex" alignItems="center" gap={0.5} fontSize={13}>
                <Favorite sx={{ color: '#f43f5e', fontSize: 18 }} /> 124 Likes
              </Box>
              <Box display="flex" alignItems="center" gap={0.5} fontSize={13}>
                <ChatBubbleOutlineOutlined sx={{ fontSize: 18 }} /> 18 Comments
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Right Form Panel */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: { xs: 3, sm: 8, md: 10, lg: 12 },
        bgcolor: '#fff'
      }}>
        <Box sx={{ maxWidth: 400, width: '100%', mx: 'auto' }}>
          {/* Brand Header */}
          <Typography variant="h5" sx={{
            fontWeight: 800,
            mb: 5,
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            SocialApp
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
            Welcome back
          </Typography>
          <Typography sx={{ color: '#64748b', mb: 4 }}>
            Enter your details below to sign in.
          </Typography>

          {error && (
            <Box sx={{
              bgcolor: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#ef4444',
              p: 1.5,
              borderRadius: 3,
              mb: 3,
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              ⚠️ {error}
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              sx={{ mb: 2.5 }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              sx={{ mb: 4 }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#94a3b8' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                py: 1.6,
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                fontWeight: 700,
                fontSize: 15,
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338ca, #4f46e5)',
                  boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
                  transform: 'translateY(-1px)'
                },
                '&:active': { transform: 'translateY(0)' },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in to account'}
            </Button>
          </form>

          <Typography textAlign="center" mt={4} sx={{ color: '#64748b', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup" underline="hover" sx={{ color: '#4f46e5', fontWeight: 700 }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}