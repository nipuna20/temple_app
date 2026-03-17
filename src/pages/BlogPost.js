import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Box, Typography } from '@mui/material';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blog/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (id) fetchPost();
  }, [id]);
  if (!post) return <Box p={3}>Loading...</Box>;
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h3" color="primary" gutterBottom>{post.title}</Typography>
      <Typography variant="subtitle1" gutterBottom>By {post.authorName}</Typography>
      {post.authorImage && <img src={post.authorImage} alt={post.authorName} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: 8 }} />}
      <Typography variant="body1" sx={{ mt: 2 }} dangerouslySetInnerHTML={{ __html: post.body }} />
    </Box>
  );
};

export default BlogPost;