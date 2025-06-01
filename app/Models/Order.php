<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_amount',
        'status'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Many-to-many relationship with Product
    public function products()
    {
        return $this->belongsToMany(Product::class)
                    ->withPivot('quantity', 'unit_price')
                    ->withTimestamps();
    }

    // Calculate total amount
    public function calculateTotal(): float
    {
        return $this->products->sum(function ($product) {
            return $product->pivot->quantity * $product->pivot->unit_price;
        });
    }
}
