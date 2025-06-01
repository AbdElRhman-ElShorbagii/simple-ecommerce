<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'products' => 'required|array|min:1',
            'products.*.product_id' => [
                'required',
                'integer',
                Rule::exists('products', 'id')->where('is_active', true)
            ],
            'products.*.quantity' => 'required|integer|min:1'
        ];
    }

    public function messages(): array
    {
        return [
            'products.*.product_id.exists' => 'The selected product must be active and exist.',
            'products.*.quantity.min' => 'Quantity must be at least 1.'
        ];
    }
}
