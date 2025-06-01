<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->resource->total(),
                'count' => $this->resource->count(),
                'per_page' => $this->resource->perPage(),
                'current_page' => $this->resource->currentPage(),
                'total_pages' => $this->resource->lastPage(),
                'has_more_pages' => $this->resource->hasMorePages(),
            ],
            'links' => [
                'first' => $this->resource->url(1),
                'last' => $this->resource->url($this->resource->lastPage()),
                'prev' => $this->resource->previousPageUrl(),
                'next' => $this->resource->nextPageUrl(),
            ],
            'filters' => $this->getActiveFilters($request),
        ];
    }

    private function getActiveFilters(Request $request): array
    {
        $filters = [];

        if ($request->filled('search')) {
            $filters['search'] = $request->search;
        }

        if ($request->filled('name')) {
            $filters['name'] = $request->name;
        }

        if ($request->filled('category')) {
            $filters['category'] = $request->category;
        }

        if ($request->filled('min_price')) {
            $filters['min_price'] = $request->min_price;
        }

        if ($request->filled('max_price')) {
            $filters['max_price'] = $request->max_price;
        }

        return $filters;
    }

    public function with(Request $request): array
    {
        return [
            'success' => true,
            'message' => 'Products retrieved successfully',
        ];
    }
}
