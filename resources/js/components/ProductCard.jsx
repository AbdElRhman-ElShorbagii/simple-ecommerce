import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Chip,
  Drawer,
  Divider,
  Button
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const ProductCard = ({ product }) => {
    const [open, setOpen] = useState(false);
    const toggleProductDrawer = () => setOpen(!open);

    return (
        <>
    <Card>
        <CardContent>
        <CardMedia
            onClick={toggleProductDrawer}
            component="img" height="140" image={product.image} alt={product.name} />
        <Typography variant="subtitle1">{product.name}</Typography>
        <Typography variant="subtitle2">${product.price}</Typography>
        <Chip label={product.tag} size="small" sx={{ mt: 1 }} />
        <Typography variant="caption" display="block">Stock: {product.stock}</Typography>
        <Box display="flex" alignItems="center" mt={1}>
            <IconButton size="small"><Remove /></IconButton>
            <Typography>{product.quantity}</Typography>
            <IconButton size="small"><Add /></IconButton>
        </Box>
        </CardContent>
    </Card>

    <Drawer anchor="right" open={open} onClose={toggleProductDrawer}>
        <Box sx={{ width: 300, p: 2 }}>
            <Typography variant="h6">Product Details</Typography>
            <Box mt={2}>
                <CardMedia component="img" height="140" image={product.image} alt={product.name} />
            </Box>
            <Typography variant="subtitle1">{product.name}</Typography>
            <Typography variant="subtitle2">${product.price}</Typography>
            <Divider sx={{ my: 3 }} />
            <Chip label={product.tag} size="small" sx={{ mt: 1 }} />
            <Typography variant="caption" display="block">Stock: {product.stock}</Typography>
            <Divider sx={{ my: 3 }} />
            <Box display="flex" alignItems="center" mt={1}>
                <Typography>Quantity</Typography>
                <IconButton size="small"><Remove /></IconButton>
                <Typography>{product.quantity}</Typography>
                <IconButton size="small"><Add /></IconButton>
            </Box>
            <Button fullWidth variant="contained" sx={{ mb: 1 }}>Add to Cart</Button>
        </Box>
    </Drawer>
    </>
    );
};

export default ProductCard;
