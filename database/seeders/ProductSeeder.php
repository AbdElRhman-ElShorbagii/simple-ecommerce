<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Gradient Graphic T-shirt',
                'img_url' => 'products/gradient_graphic_tshirt.jpg',
                'price' => 145,
                'stock_quantity' => 25,
                'category' => 'T-shirts'
            ],
            [
                'name' => 'Polo with Tipping Details',
                'img_url' => 'products/polo_with_tipping_details.jpg',
                'price' => 25.99,
                'stock_quantity' => 100,
                'category' => 'Electronics'
            ],
            [
                'name' => 'Black Striped T-shirt',
                'img_url' => 'products/black_striped_tshirt.jpg',
                'price' => 39.99,
                'stock_quantity' => 30,
                'category' => 'Books'
            ],
            [
                'name' => 'Skinny Fit Jeans',
                'img_url' => 'products/skinny_fit_jeans.jpg',
                'price' => 39.99,
                'stock_quantity' => 30,
                'category' => 'Books'
            ],
            [
                'name' => 'Checkered Shirt',
                'img_url' => 'products/checkered_shirt.jpg',
                'price' => 39.99,
                'stock_quantity' => 30,
                'category' => 'Books'
            ],
            [
                'name' => 'Sleeve Striped T-shirt',
                'img_url' => 'products/sleeve_striped_tshirt.jpg',
                'price' => 39.99,
                'stock_quantity' => 30,
                'category' => 'Books'
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
