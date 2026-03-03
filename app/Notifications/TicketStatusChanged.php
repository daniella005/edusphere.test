<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketStatusChanged extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $ticket;

public function __construct($ticket)
{
    $this->ticket = $ticket;
}

public function via(object $notifiable): array
{
    // On active la base de données ET le mail
    return ['mail', 'database'];
}

public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->subject('Mise à jour de votre ticket #' . substr($this->ticket->id, 0, 8))
        ->line('Le statut de votre ticket de support a été modifié.')
        ->line('Nouveau statut : ' . strtoupper($this->ticket->status))
        ->action('Voir mon ticket', url('/support/tickets/' . $this->ticket->id))
        ->line('Merci de nous faire confiance.');
}

public function toDatabase($notifiable)
{
    return [
        'ticket_id' => $this->ticket->id,
        'subject' => $this->ticket->subject,
        'new_status' => $this->ticket->status,
        'message' => "Le statut de votre ticket a été mis à jour : " . $this->ticket->status,
    ];
}
}
