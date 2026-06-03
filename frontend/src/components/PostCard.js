import React, { useState } from 'react';
import {
  Paper, Box, Avatar, Typography, IconButton,
  TextField, Divider, Collapse
} from '@mui/material';
import {
  FavoriteBorder, Favorite, ChatBubbleOutlineOutlined, SendRounded
} from '@mui/icons-material';
import API, { IMAGE_BASE } from '../api';

export default function PostCard({ post, currentUser, onUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText]   = useState('');
  const [loading, setLoading]           = useState(false);

  const isLiked = post.likes?.includes(currentUser);

  const timeAgo = (date) => {
    const diff = Math.max(0, Math.floor((new Date() - new Date(date)) / 1000));
    if (diff < 60)    return `${diff}s ago`;
    if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  };

  const handleLike = async () => {
    try {
      const { data } = await API.put(`/posts/${post._id}/like`);
      onUpdate(data);
    } catch (err) { console.error(err); }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      const { data } = await API.post(`/posts/${post._id}/comment`,
        { text: commentText });
      onUpdate(data);
      setCommentText('');
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <Paper elevation={0} sx={{
      borderRadius: 4,
      mb: 3,
      overflow: 'hidden',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
      background: '#fff',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.04)'
      }
    }}>
      {/* Post Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2.5} pb={1.5}>
        <Box display="flex" alignItems="center" gap={1.8}>
          <Avatar sx={{
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            width: 44,
            height: 44,
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.15)'
          }}>
            {post.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontWeight="700" fontSize={15} color="#1e293b">
              {post.username}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              @{post.username} · {timeAgo(post.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Post Content */}
      {post.content && (
        <Typography px={2.5} pb={2} fontSize={14.5} color="#334155" lineHeight={1.6}>
          {post.content}
        </Typography>
      )}

      {/* Post Image */}
      {post.image && (
        <Box px={2.5} pb={2}>
          <img
            src={`${IMAGE_BASE}${post.image}`}
            alt="post"
            style={{
              width: '100%',
              borderRadius: 12,
              maxHeight: 320,
              objectFit: 'cover',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}
          />
        </Box>
      )}

      <Divider sx={{ borderColor: '#f1f5f9' }} />

      {/* Like & Comment counts */}
      <Box display="flex" px={2.5} py={1} gap={3}>
        <Typography fontSize={12.5} fontWeight="500" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
          ❤️ {post.likes?.length || 0} Likes
        </Typography>
        <Typography fontSize={12.5} fontWeight="500" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
          💬 {post.comments?.length || 0} Comments
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#f1f5f9' }} />

      {/* Action Buttons */}
      <Box display="flex" px={1.5} py={0.5} gap={1}>
        <IconButton
          onClick={handleLike}
          sx={{
            flex: 1,
            borderRadius: 3,
            gap: 1,
            py: 1,
            color: isLiked ? '#ef4444' : 'text.secondary',
            '&:hover': { bgcolor: isLiked ? 'rgba(239, 68, 68, 0.05)' : 'rgba(0,0,0,0.02)' }
          }}
        >
          {isLiked
            ? <Favorite sx={{ color: '#ef4444', fontSize: 20 }} />
            : <FavoriteBorder sx={{ fontSize: 20 }} />}
          <Typography fontSize={13} fontWeight="600">
            Like
          </Typography>
        </IconButton>

        <IconButton
          onClick={() => setShowComments(!showComments)}
          sx={{
            flex: 1,
            borderRadius: 3,
            gap: 1,
            py: 1,
            color: showComments ? '#4f46e5' : 'text.secondary',
            '&:hover': { bgcolor: showComments ? 'rgba(79, 70, 229, 0.05)' : 'rgba(0,0,0,0.02)' }
          }}
        >
          <ChatBubbleOutlineOutlined sx={{ fontSize: 20 }} />
          <Typography fontSize={13} fontWeight="600">
            Comment
          </Typography>
        </IconButton>
      </Box>

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Divider sx={{ borderColor: '#f1f5f9' }} />
        <Box px={2.5} py={2} sx={{ bgcolor: '#fafafa' }}>
          {/* Comment Input */}
          <Box display="flex" gap={1.5} mb={2.5} alignItems="center">
            <Avatar sx={{
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              width: 34,
              height: 34,
              fontSize: 13,
              fontWeight: 'bold'
            }}>
              {currentUser?.[0]?.toUpperCase()}
            </Avatar>
            <TextField
              fullWidth size="small"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                  backgroundColor: '#fff',
                  '& fieldset': { borderColor: 'rgba(226, 232, 240, 0.8)' },
                  '&:hover fieldset': { borderColor: '#cbd5e1' },
                  '&.Mui-focused fieldset': { borderColor: '#4f46e5' }
                }
              }}
            />
            <IconButton
              color="primary"
              onClick={handleComment}
              disabled={loading}
              sx={{
                bgcolor: '#4f46e5',
                color: '#fff',
                width: 36,
                height: 36,
                '&:hover': { bgcolor: '#4338ca' },
                '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' }
              }}
            >
              <SendRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Comments List */}
          {post.comments?.slice().reverse().map((c, i) => (
            <Box key={i} display="flex" gap={1.5} mb={2}>
              <Avatar sx={{
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                width: 32,
                height: 32,
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                {c.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{
                bgcolor: '#fff',
                borderRadius: 3,
                px: 2,
                py: 1.2,
                flex: 1,
                border: '1px solid rgba(226, 232, 240, 0.6)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.4}>
                  <Typography fontSize={13} fontWeight="700" color="#1e293b">{c.username}</Typography>
                  <Typography fontSize={10} color="text.secondary">{timeAgo(c.createdAt)}</Typography>
                </Box>
                <Typography fontSize={13} color="#334155">{c.text}</Typography>
              </Box>
            </Box>
          ))}

          {post.comments?.length === 0 && (
            <Typography fontSize={13} color="text.secondary" textAlign="center" py={1.5}>
              No comments yet. Be the first! 💬
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}