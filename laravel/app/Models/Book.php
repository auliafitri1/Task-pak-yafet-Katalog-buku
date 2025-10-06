<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'cover',
        'description',
        'rating',
        'pages',
        'published',
        'category',
        'language',
        'publisher',
        'isbn',
    ];
}
