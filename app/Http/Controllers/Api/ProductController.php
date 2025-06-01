<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $cacheKey = 'products_' . md5($request->getQueryString() ?? '');

        $products = Cache::remember($cacheKey, 300, function () use ($request) {
            $query = Product::active();

            // Apply filters
            if ($request->filled('name')) {
                $query->byName($request->name);
            }

            if ($request->filled('min_price') || $request->filled('max_price')) {
                $query->byPriceRange($request->min_price, $request->max_price);
            }

            // Updated to handle multiple categories
            if ($request->filled('categories')) {
                $categories = is_array($request->categories)
                    ? $request->categories
                    : explode(',', $request->categories);

                // Remove empty values and trim whitespace
                $categories = array_filter(array_map('trim', $categories));

                if (!empty($categories)) {
                    $query->whereIn('category', $categories);
                }
            }

            // Keep backwards compatibility with single category filter
            if ($request->filled('category') && !$request->filled('categories')) {
                $query->byCategory($request->category);
            }

            // Search functionality
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = min($request->get('per_page', 15), 100);
            return $query->orderBy('name')->paginate($perPage);
        });

        return new ProductCollection($products);
    }

    public function show(Product $product)
    {
        return new ProductResource($product);
    }
}
