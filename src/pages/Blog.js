import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/blog', { params: { status: 'published' } });
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, []);
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h3" color="primary" gutterBottom>Blog & Articles</Typography>
      {posts.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No blog posts have been published yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {post.authorImage && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.authorImage}
                    alt={post.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>{post.title}</Typography>
                  <Typography variant="body2" color="text.secondary">By {post.authorName}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                    {post.description?.slice(0, 120)}...
                  </Typography>
                </CardContent>
                <Box sx={{ p: 1, textAlign: 'right' }}>
                  <Button component={RouterLink} to={`/blog/${post.id}`} size="small">
                    Read More
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Blog;