<?php

use Illuminate\Support\Facades\Route;

// Catch-all route for React SPA
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
