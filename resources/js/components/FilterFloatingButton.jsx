import React, { useState } from 'react';
import { IconButton, Box, Drawer, Typography, Slider, Checkbox, FormControlLabel, Button, Divider } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

const categories = ['T-shirts', 'Polo', 'Jeans', 'Shirts'];

const FilterFloatingButton = () => {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState([0, 300]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleDrawer = () => setOpen(!open);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setPrice([0, 300]);
    setSelectedCategories([]);
  };

  return (
    <>
      <Box sx={{
        display: {
            xs: 'none',
            sm: 'none',
            md: 'flex',
            },
        position: 'fixed', top: 130, left: 0 }}>
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
            color: 'black'
          }}
        >
          <TuneIcon />
        </Box>
      </Box>

      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6">Filters</Typography>

          <Box mt={2}>
            <Typography variant="subtitle2">Price</Typography>
            <Slider
              value={price}
              onChange={(e, newValue) => setPrice(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={300}
            />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption">${price[0]}</Typography>
              <Typography variant="caption">${price[1]}</Typography>
            </Box>
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle2">Category</Typography>
            <FormControlLabel
              control={<Checkbox checked={selectedCategories.length === 0} onChange={clearFilters} />}
              label="All"
            />
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                }
                label={category}
              />
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Button fullWidth variant="contained" sx={{ mb: 1 }}>Apply Filter</Button>
          <Button fullWidth onClick={clearFilters}>Clear all filters</Button>
        </Box>
      </Drawer>
    </>
  );
};

export default FilterFloatingButton;
