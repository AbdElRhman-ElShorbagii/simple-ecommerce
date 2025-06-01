<?php

namespace App\Http\Controllers\Api;

use App\Events\OrderPlaced;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $user = $request->user();
            $productData = $request->products;

            // Validate stock availability
            foreach ($productData as $item) {
                $product = Product::find($item['product_id']);

                if ($product->stock_quantity < $item['quantity']) {
                    return response()->json([
                        'success' => false,
                        'message' => "Insufficient stock for product: {$product->name}. Available: {$product->stock_quantity}"
                    ], 422);
                }
            }

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => 0, // Will be calculated after attaching products
                'status' => 'pending'
            ]);

            $totalAmount = 0;

            // Attach products to order
            foreach ($productData as $item) {
                $product = Product::find($item['product_id']);
                $unitPrice = $product->price;
                $quantity = $item['quantity'];

                $order->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice
                ]);

                // Update product stock
                $product->decrement('stock_quantity', $quantity);

                $totalAmount += $unitPrice * $quantity;
            }

            // Update order total
            $order->update(['total_amount' => $totalAmount]);

            // Fire order placed event
            OrderPlaced::dispatch($order);

            // Load relationships for response
            $order->load('products');

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => $order
            ], 201);
        });
    }

    public function show(Order $order, Request $request)
    {
        // Ensure user can only view their own orders
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $order->load(['products' => function ($query) {
            $query->withPivot('quantity', 'unit_price');
        }]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $order->id,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at,
                'products' => $order->products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'img_url' => $product->img_url,
                        'category' => $product->category,
                        'stock_quantity' => $product->stock_quantity,
                        'unit_price' => $product->pivot->unit_price,
                        'quantity' => $product->pivot->quantity,
                        'subtotal' => $product->pivot->unit_price * $product->pivot->quantity
                    ];
                })
            ]
        ]);
    }

    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
                      ->with(['products' => function ($query) {
                          $query->withPivot('quantity', 'unit_price');
                      }])
                      ->orderBy('created_at', 'desc')
                      ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }
}
