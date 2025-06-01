import React, { useState, useEffect } from 'react';
import { IconButton, Box, Drawer, Typography, Slider, Checkbox, FormControlLabel, Button, Divider } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

const FilterFloatingButton = ({
  onFiltersChange,
  initialFilters = { price: [0, 300], categories: [] },
  categories = ['T-shirts', 'Polo', 'Jeans', 'Shirts', 'Books', 'Electronics']
}) => {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(initialFilters.price);
  const [selectedCategories, setSelectedCategories] = useState(initialFilters.categories);

  const toggleDrawer = () => setOpen(!open);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAllCategoriesChange = () => {
    if (selectedCategories.length === 0) {
      // If "All" is unchecked when all are selected, clear all
      setSelectedCategories([]);
    } else {
      // If "All" is checked, clear all categories (show all)
      setSelectedCategories([]);
    }
  };

  const clearFilters = () => {
    setPrice([0, 300]);
    setSelectedCategories([]);
  };

  const applyFilters = () => {
    const filters = {
      price: price,
      categories: selectedCategories,
      minPrice: price[0],
      maxPrice: price[1]
    };

    onFiltersChange?.(filters);
    setOpen(false); // Close drawer after applying
  };

  // Apply filters automatically when they change (for real-time filtering)
  useEffect(() => {
    const filters = {
      price: price,
      categories: selectedCategories,
      minPrice: price[0],
      maxPrice: price[1]
    };

    onFiltersChange?.(filters);
  }, [price, selectedCategories, onFiltersChange]);

  const hasActiveFilters = price[0] > 0 || price[1] < 300 || selectedCategories.length > 0;

  return (
    <>
      <Box sx={{
        display: {
          xs: 'none',
          sm: 'none',
          md: 'flex',
        },
        position: 'fixed',
        top: 130,
        left: 0,
        zIndex: 1000
      }}>
        <Box
          onClick={toggleDrawer}
          sx={{
            backgroundColor: '#fff',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: 1,
            color: hasActiveFilters ? 'primary.main' : 'black',
            border: hasActiveFilters ? '2px solid' : '1px solid #e0e0e0',
            borderColor: hasActiveFilters ? 'primary.main' : '#e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <TuneIcon />
          {hasActiveFilters && (
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 12,
                height: 12,
                backgroundColor: 'primary.main',
                borderRadius: '50%'
              }}
            />
          )}
        </Box>
      </Box>

      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filters
            {hasActiveFilters && (
              <Typography variant="caption" color="primary.main" sx={{ ml: 1 }}>
                (Active)
              </Typography>
            )}
          </Typography>

          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Price Range
            </Typography>
            <Slider
              value={price}
              onChange={(e, newValue) => setPrice(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={300}
              sx={{ mt: 2 }}
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="caption">${price[0]}</Typography>
              <Typography variant="caption">${price[1]}</Typography>
            </Box>
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle2" gutterBottom>
              Categories
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedCategories.length === 0}
                  onChange={handleAllCategoriesChange}
                  indeterminate={selectedCategories.length > 0 && selectedCategories.length < categories.length}
                />
              }
              label={
                <Typography variant="body2">
                  All Categories {selectedCategories.length === 0 && '(Selected)'}
                </Typography>
              }
            />
            <Box sx={{ ml: 2 }}>
              {categories.map((category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">{category}</Typography>}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={applyFilters}
              sx={{ flex: 1 }}
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              onClick={clearFilters}
              sx={{ flex: 1 }}
              disabled={!hasActiveFilters}
            >
              Clear
            </Button>
          </Box>

          {hasActiveFilters && (
            <Box mt={2} p={1} bgcolor="grey.50" borderRadius={1}>
              <Typography variant="caption" color="text.secondary">
                Active Filters:
              </Typography>
              {(price[0] > 0 || price[1] < 300) && (
                <Typography variant="caption" display="block">
                  • Price: ${price[0]} - ${price[1]}
                </Typography>
              )}
              {selectedCategories.length > 0 && (
                <Typography variant="caption" display="block">
                  • Categories: {selectedCategories.join(', ')}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default FilterFloatingButton;
