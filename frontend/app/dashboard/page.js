"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";  // Import the useAuthGuard hook

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api";
import { useDispatch } from "react-redux";
import { setTasks, addTask, updateTask as updateTaskRedux, deleteTask as deleteTaskRedux } from "@/store/taskSlice";
import { openTaskModal } from "@/store/uiSlice";
import { Button } from "@/components/ui/button";
import TaskModal from "@/components/TaskModal";
import ReadMore from "@/components/ReadMore";
import Spinner from "@/components/Spinner";

export default function DashboardPage() {
  const { status, isReady } = useAuthGuard();  // Use the auth guard hook
  
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [taskToEdit, setTaskToEdit] = useState(null);

  // Fetch tasks from DB (only when the user is authenticated and the auth guard is ready)
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    onSuccess: (data) => dispatch(setTasks(data)),
    enabled: isReady && status === "authenticated",  // Only fetch tasks when authenticated and ready
  });

  // Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      dispatch(addTask(newTask));
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Update Task Mutation
  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask) => {
      dispatch(updateTaskRedux(updatedTask));
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Delete Task Mutation
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (taskId) => {
      dispatch(deleteTaskRedux(taskId));
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Show loading spinner while checking session or fetching tasks
  if (!isReady || status === "loading" || isLoading) {
    return (
      <div className="flex items-center flex-col">
        <Spinner />
        <span>Loading...</span>
      </div>
    );
  }

  // Handle error state
  if (error) return <p className="text-red-500">Error loading tasks</p>;

  return (
    <>
      <div className="flex justify-between items-center">
        <h6 className="font-bold">{tasks.length === 0 ? "You have no tasks" : "Your Tasks"}</h6>
        <Button
          onClick={() => {
            setTaskToEdit(null);
            dispatch(openTaskModal());
          }}
          className="mt-4"
        >
          Add New Task
        </Button>
      </div>

      <TaskModal
        taskToEdit={taskToEdit}
        onUpdateTask={(task) => updateTaskMutation.mutate(task)}
        onCreateTask={(task) => createTaskMutation.mutate(task)}
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.length === 0 ? (
          <div className="w-full bg-white p-4 shadow-md rounded-md">
            You don't have any tasks
          </div>
        ) : null}

        {tasks?.map((task) => (
          <div key={task.id} className="bg-white p-4 shadow-md rounded-md">
            <div className="flex justify-between">
              <h3 className="font-bold dark:text-gray-600">{task.title}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-600">
                Status: {task.completed ? "Done" : "Pending"}
              </span>
            </div>
            <ReadMore text={task.description} />
            <div className="mt-2 flex space-x-2">
              <Button
                onClick={() => {
                  setTaskToEdit(task);
                  dispatch(openTaskModal());
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteTaskMutation.mutate(task.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
