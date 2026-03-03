<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('ticket_comments', function (Blueprint $table) {
            // Si la colonne s'appelait support_ticket_id, on la renomme
            if (Schema::hasColumn('ticket_comments', 'support_ticket_id')) {
                $table->renameColumn('support_ticket_id', 'ticket_id');
            } 
            // Si elle n'existe pas du tout, on la crée
            elseif (!Schema::hasColumn('ticket_comments', 'ticket_id')) {
                $table->foreignUuid('ticket_id')->constrained('support_tickets')->onDelete('cascade');
            }

            // On fait la même chose pour 'comment' vers 'content'
            if (Schema::hasColumn('ticket_comments', 'comment')) {
                $table->renameColumn('comment', 'content');
            }
        });
    }

    public function down(): void {
        Schema::table('ticket_comments', function (Blueprint $table) {
            $table->renameColumn('ticket_id', 'support_ticket_id');
            $table->renameColumn('content', 'comment');
        });
    }
};