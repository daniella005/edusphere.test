<?php

use Illuminate\Support\Facades\Route;

// Route pour votre application React
Route::get('/{any?}', function () {
    return view('edusphere-connect');
})->where('any', '.*');