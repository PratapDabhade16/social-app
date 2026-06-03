import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Tabs, Tab, CircularProgress, Button
} from '@mui/material';
import { LogoutRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

// Fixed: Moved outside the component so it remains completely static and doesn't trigger hook updates
const sortMap = ['createdAt', 'likes', 'comments'];

export default function Feed() {
  const [posts, setPosts]       = useState([]);
  const [tab, setTab]           = useState(0);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(true);
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();
  const username                = localStorage.getItem('username');

  const fetchPosts = useCallback(async (pageToFetch, reset = false) => {
    setLoading(true);
    try {
      const { data } = await API.get('/posts', {
        params: { page: pageToFetch, limit: 10, sort: sortMap[tab] }
      });
      
      setPosts(prev => reset ? data.posts : [...prev, ...data.posts]);
      setHasMore(pageToFetch < data.pages);
      setPage(pageToFetch + 1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev =>
      prev.map(p => p._id === updatedPost._id ? updatedPost : p)
    );
  };

  return (
    <Box sx={{ background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)', minHeight: '100vh', pb: 6 }}>
      {/* Header */}
      <Box sx={{
        background: 'rgba(255, 255, 255, 0.85)', px: 3, py: 1.8,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
        backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          SocialApp
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{
            bgcolor: 'rgba(79, 70, 229, 0.08)',
            px: 2, py: 0.6, borderRadius: 5,
            border: '1px solid rgba(79, 70, 229, 0.15)',
            display: 'flex', alignItems: 'center', gap: 1
          }}>
            <Box sx={{ width: 6, height: 6, bgcolor: '#10b981', borderRadius: '50%' }} />
            <Typography fontSize={13} fontWeight="600" color="indigo">@{username}</Typography>
          </Box>
          <Button size="small" variant="outlined" color="error" onClick={handleLogout}
            startIcon={<LogoutRounded />}
            sx={{
              borderRadius: 3, px: 2, textTransform: 'none', fontWeight: 600,
              border: '1px solid rgba(239, 68, 68, 0.3)',
              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.05)', border: '1px solid #ef4444' }
            }}>
            Logout
          </Button>
        </Box>
      </Box>

      <Container maxWidth="sm" sx={{ mt: 2 }}>
        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Filter Tabs */}
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.7)', borderRadius: 4,
          mt: 3, mb: 2, px: 1, py: 0.5,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          backdropFilter: 'blur(5px)'
        }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}
            variant="scrollable" scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px',
                background: 'linear-gradient(90deg, #4f46e5, #6366f1)'
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: '#4f46e5'
                }
              }
            }}>
            <Tab label="All Posts" />
            <Tab label="Most Liked" />
            <Tab label="Most Commented" />
          </Tabs>
        </Box>

        {/* Posts */}
        {posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={username}
            onUpdate={handlePostUpdated}
          />
        ))}

        {/* Load More */}
        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
        {!loading && hasMore && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="contained"
              onClick={() => fetchPosts(page, false)}
              sx={{
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                color: '#fff', borderRadius: 3, px: 4, py: 1,
                textTransform: 'none', fontWeight: 600,
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338ca, #4f46e5)',
                  boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Load More
            </Button>
          </Box>
        )}
        {!hasMore && posts.length > 0 && (
          <Typography textAlign="center" color="text.secondary" mt={2} fontSize={13}>
            You've seen all posts 🎉
          </Typography>
        )}
      </Container>
    </Box>
  );
}