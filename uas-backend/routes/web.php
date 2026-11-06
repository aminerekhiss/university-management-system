<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->make(
        '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/browser/"><title>Redirecting</title></head><body>Redirecting to the app...</body></html>',
        200
    );
});

Route::get('/browser', function () {
    return file_exists(public_path('browser/index.html'))
        ? response()->file(public_path('browser/index.html'))
        : response('Angular build not found', 503);
});

Route::get('/browser/{any}', function () {
    return file_exists(public_path('browser/index.html'))
        ? response()->file(public_path('browser/index.html'))
        : response('Angular build not found', 503);
})->where('any', '.*');
