<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\StatusResource;
use App\Http\Resources\TaskResource;
use App\Models\Status;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the user's tasks.
     */
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->tasks()->with('status');

        // Search by title
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->filled('status_id')) {
            $query->where('status_id', $request->status_id);
        }

        $tasks = $query->latest()->paginate($request->per_page ?? 10);

        return response()->json([
            'tasks' => TaskResource::collection($tasks),
            'pagination' => [
                'total' => $tasks->total(),
                'per_page' => $tasks->perPage(),
                'current_page' => $tasks->currentPage(),
                'last_page' => $tasks->lastPage(),
                'from' => $tasks->firstItem(),
                'to' => $tasks->lastItem(),
            ],
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $request->user()->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'status_id' => $request->status_id,
        ]);

        $task->load('status');

        return response()->json([
            'message' => 'Task created successfully.',
            'task' => new TaskResource($task),
        ], 201);
    }

    /**
     * Display the specified task.
     */
    public function show(Request $request, Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        $task->load('status');

        return response()->json([
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Update the specified task.
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $task->update($request->validated());
        $task->load('status');

        return response()->json([
            'message' => 'Task updated successfully.',
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Request $request, Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully.',
        ]);
    }

    /**
     * Get all statuses.
     */
    public function statuses(): JsonResponse
    {
        $statuses = Status::all();

        return response()->json([
            'statuses' => StatusResource::collection($statuses),
        ]);
    }
}
