<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Post extends Model
{
    use HasFactory;

    public static function getCommercePost($id)
    {
        return DB::table('posts')->where('id_comercio', $id)->where('visible', 1)->get();
    }

    public static function createPost($arrayPost){
        $postId = DB::table('posts')->insertGetId($arrayPost);
        return DB::table('posts')->where('id', $postId)->first();
    }

    public static function deletePost($id)
    {
        $deleted = DB::table('posts')->where('id', $id)->update(['visible' => 0]);
        if($deleted == 0){
            return false;
        }

        return true;
    }

    public static function findPost($id)
    {
        return DB::table('posts')->where('id', $id)->first();
    }

    public static function getLastFollowedPosts($seguidoIds) {
        return DB::table('posts')
            ->whereIn('id_comercio', $seguidoIds)
            ->orderBy('fecha', 'desc')
            ->where('visible' , 1)
            ->get();
    }


}
