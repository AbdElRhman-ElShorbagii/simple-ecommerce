<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image_url' => url($this->img_url),
            'price' => number_format($this->price, 2),
            'price_raw' => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'category' => $this->category,
            'is_active' => $this->is_active,
            'in_stock' => $this->stock_quantity > 0,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
