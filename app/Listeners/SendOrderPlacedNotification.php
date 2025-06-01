<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class SendOrderPlacedNotification implements ShouldQueue
{
    public function handle(OrderPlaced $event): void
    {
        // Simulate sending email to admin
        Log::info('Order placed notification sent to admin', [
            'order_id' => $event->order->id,
            'total_amount' => $event->order->total_amount,
            'user_id' => $event->order->user_id
        ]);

        // In a real application, you would send an actual email here:
        // Mail::to('admin@example.com')->send(new OrderPlacedMail($event->order));
    }
}
