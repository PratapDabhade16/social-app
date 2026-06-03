import React, { useState } from 'react';
import {
  Box, Paper, TextField, Button, Avatar,
  Typography, IconButton, Tooltip
} from '@mui/material';
import { PhotoCamera, SendRounded } from '@mui/icons-material';
import API from '../api';

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const username              = localStorage.getItem('username');

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!content && !image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);

      const { data } = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onPostCreated(data);
      setContent('');
      setImage(null);
      setPreview('');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Paper elevation={0} sx={{
      p: 2.5,
      borderRadius: 4,
      background: '#fff',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)'
    }}>
      <Typography fontWeight="800" fontSize={16} mb={2} color="#1e293b" letterSpacing="-0.3px">
        Create Post
      </Typography>

      <Box display="flex" gap={2}>
        <Avatar sx={{
          background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
          width: 42,
          height: 42,
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)'
        }}>
          {username?.[0]?.toUpperCase()}
        </Avatar>
        <TextField
          fullWidth multiline rows={2}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#f8fafc',
              transition: 'all 0.2s ease-in-out',
              '&.Mui-focused': {
                backgroundColor: '#fff',
              }
            }
          }}
        />
      </Box>

      {/* Image Preview */}
      {preview && (
        <Box mt={2} sx={{ position: 'relative', display: 'inline-block' }}>
          <img src={preview} alt="preview"
            style={{ maxWidth: '100%', borderRadius: 12, maxHeight: 220, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
          <Button size="small" color="error"
            onClick={() => { setImage(null); setPreview(''); }}
            sx={{ position: 'absolute', top: 8, right: 8, minWidth: 'auto',
              bgcolor: 'rgba(15, 23, 42, 0.6)', color: '#fff', borderRadius: 2, p: 0.5,
              backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.8)' } }}>
            ✕
          </Button>
        </Box>
      )}

      {/* Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2.5}>
        <Tooltip title="Add Photo">
          <IconButton component="label" sx={{
            color: '#4f46e5',
            bgcolor: 'rgba(79, 70, 229, 0.05)',
            '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.1)' }
          }}>
            <PhotoCamera />
            <input hidden accept="image/*" type="file" onChange={handleImage} />
          </IconButton>
        </Tooltip>

        <Button
          variant="contained" endIcon={<SendRounded />}
          onClick={handleSubmit} disabled={loading || (!content && !image)}
          sx={{
            borderRadius: 3, px: 3.5, py: 1,
            textTransform: 'none', fontWeight: 600,
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4338ca, #4f46e5)',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 15px rgba(79, 70, 229, 0.3)'
            },
            transition: 'all 0.2s ease-in-out'
          }}>
          Post
        </Button>
      </Box>
    </Paper>
  );
}