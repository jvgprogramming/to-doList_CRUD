<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'task_id' => $this->task_id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'status_id' => $this->status_id,
            'status' => new StatusResource($this->whenLoaded('status')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
