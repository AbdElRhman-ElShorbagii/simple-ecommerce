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

const ProductCard = ({ product, onQuantityChange }) => {
    const [open, setOpen] = useState(false);
    const toggleProductDrawer = () => setOpen(!open);

    // Handle quantity increase
    const handleIncrease = () => {
        if (product.quantity < product.stock) {
            const newQuantity = product.quantity + 1;
            onQuantityChange?.(newQuantity);
        }
    };

    // Handle quantity decrease
    const handleDecrease = () => {
        if (product.quantity > 0) {
            const newQuantity = product.quantity - 1;
            onQuantityChange?.(newQuantity);
        }
    };

    // Handle direct add to cart
    const handleAddToCart = () => {
        if (product.quantity === 0 && product.stock > 0) {
            onQuantityChange?.(1);
        }
    };

    // Check if product is out of stock
    const isOutOfStock = product.stock === 0 || !product.inStock;

    // Check if we can add more items
    const canIncrease = product.quantity < product.stock && !isOutOfStock;
    const canDecrease = product.quantity > 0;

    return (
        <>
            <Card sx={{
                opacity: isOutOfStock ? 0.6 : 1,
                position: 'relative'
            }}>
                <CardContent>
                    <CardMedia
                        onClick={toggleProductDrawer}
                        component="img"
                        height="140"
                        image={product.image}
                        alt={product.name}
                        sx={{ cursor: 'pointer' }}
                    />

                    {isOutOfStock && (
                        <Chip
                            label="Out of Stock"
                            color="error"
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8
                            }}
                        />
                    )}

                    <Typography variant="subtitle1">{product.name}</Typography>
                    <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                        ${product.price}
                    </Typography>
                    <Chip label={product.tag} size="small" sx={{ mt: 1 }} />
                    <Typography variant="caption" display="block" color={product.stock < 10 ? 'error.main' : 'text.secondary'}>
                        Stock: {product.stock}
                        {product.stock < 10 && product.stock > 0 && ' (Low Stock)'}
                    </Typography>

                    {product.quantity > 0 ? (
                        <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                            <IconButton
                                size="small"
                                onClick={handleDecrease}
                                disabled={!canDecrease}
                            >
                                <Remove />
                            </IconButton>
                            <Typography sx={{ mx: 2, minWidth: '20px', textAlign: 'center' }}>
                                {product.quantity}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={handleIncrease}
                                disabled={!canIncrease}
                            >
                                <Add />
                            </IconButton>
                        </Box>
                    ) : (
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Drawer anchor="right" open={open} onClose={toggleProductDrawer}>
                <Box sx={{ width: 300, p: 2 }}>
                    <Typography variant="h6" gutterBottom>Product Details</Typography>

                    <Box mt={2} position="relative">
                        <CardMedia
                            component="img"
                            height="200"
                            image={product.image}
                            alt={product.name}
                        />
                        {isOutOfStock && (
                            <Chip
                                label="Out of Stock"
                                color="error"
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8
                                }}
                            />
                        )}
                    </Box>

                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {product.name}
                    </Typography>
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                        ${product.price}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="body2">Category:</Typography>
                        <Chip label={product.tag} size="small" />
                    </Box>

                    <Typography
                        variant="body2"
                        color={product.stock < 10 ? 'error.main' : 'text.secondary'}
                        gutterBottom
                    >
                        Stock Available: {product.stock}
                        {product.stock < 10 && product.stock > 0 && ' (Limited Stock)'}
                    </Typography>

                    {product.stock > 0 && (
                        <Typography variant="caption" color="success.main" display="block">
                            ✓ In Stock
                        </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="body1">Quantity:</Typography>
                        <Box display="flex" alignItems="center">
                            <IconButton
                                size="small"
                                onClick={handleDecrease}
                                disabled={!canDecrease}
                            >
                                <Remove />
                            </IconButton>
                            <Typography sx={{ mx: 2, minWidth: '30px', textAlign: 'center' }}>
                                {product.quantity}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={handleIncrease}
                                disabled={!canIncrease}
                            >
                                <Add />
                            </IconButton>
                        </Box>
                    </Box>

                    {product.quantity > 0 ? (
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Subtotal: ${(product.price * product.quantity).toFixed(2)}
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => onQuantityChange?.(product.quantity + 1)}
                                disabled={!canIncrease}
                                sx={{ mb: 1 }}
                            >
                                Add More
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                onClick={() => onQuantityChange?.(0)}
                            >
                                Remove from Cart
                            </Button>
                        </Box>
                    ) : (
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            sx={{ mb: 1 }}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default ProductCard;
