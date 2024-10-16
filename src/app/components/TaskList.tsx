'use client';
import React, { useState, useEffect } from 'react';
import { Task } from '../api/to-do/route';

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskName, setNewTaskName] = useState<string>('');
    const [newTaskDescription, setNewTaskDescription] = useState<string>('');
    const [newTaskDate, setNewTaskDate] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editTaskName, setEditTaskName] = useState<string>('');
    const [editTaskDescription, setEditTaskDescription] = useState<string>('');
    const [editTaskDate, setEditTaskDate] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchTasks();
    }, [filterStatus]);

    const fetchTasks = async (): Promise<void> => {
        const response = await fetch(`/api/to-do?status=${filterStatus}`);
        const data: Task[] = await response.json();
        setTasks(data);
    };

    const handleAddTask = async (): Promise<void> => {
        const newTask: Task = {
            id: Date.now(),
            name: newTaskName,
            date: newTaskDate,
            description: newTaskDescription,
            completed: false,
        };

        const response = await fetch('/api/to-do', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        });

        const createdTask: Task = await response.json();
        setTasks((prevTasks) => [...prevTasks, createdTask]);
        setNewTaskName('');
        setNewTaskDate('');
        setNewTaskDescription('');
    };

    const handleEditTask = (taskId: number): void => {
        const taskToEdit = tasks.find(task => task.id === taskId);
        if (taskToEdit) {
            setIsEditing(true);
            setEditingTaskId(taskId);
            setEditTaskName(taskToEdit.name);
            setEditTaskDescription(taskToEdit.description);
            setEditTaskDate(taskToEdit.date);
        }
    };

    const handleSaveEdit = async (): Promise<void> => {
        if (editingTaskId === null) return;

        const updatedTask: Task = {
            id: editingTaskId,
            name: editTaskName,
            description: editTaskDescription,
            date: editTaskDate,
            completed: tasks.find(task => task.id === editingTaskId)?.completed || false,
        };

        const response = await fetch('/api/to-do', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });

        const updatedResponseTask: Task = await response.json();
        setTasks(tasks.map(task => (task.id === editingTaskId ? updatedResponseTask : task)));
        setIsEditing(false);
        setEditingTaskId(null);
    };

    const handleDeleteTask = async (taskId: number): Promise<void> => {
        await fetch('/api/to-do', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: taskId }),
        });
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleToggleComplete = async (taskId: number): Promise<void> => {
        const taskToToggle = tasks.find(task => task.id === taskId);
        if (taskToToggle) {
            const updatedTask: Task = { ...taskToToggle, completed: !taskToToggle.completed };

            const response = await fetch('/api/to-do', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask),
            });

            const updatedResponseTask: Task = await response.json();
            setTasks(tasks.map(task => (task.id === taskId ? updatedResponseTask : task)));
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg mt-6">
            <h1 className="text-4xl font-bold mb-6 text-center">Task Manager</h1>
            <div className="mb-6">
                <label className="mr-2 font-semibold">Filter:</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="New Task"
                    className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleAddTask}
                    className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Add Task
                </button>
            </div>

            <ul className="space-y-2">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className={`flex justify-between items-center p-4 rounded-lg transition duration-300 ${task.completed ? 'bg-green-100' : 'bg-gray-100'}`}
                    >
                        <div>
                            <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <div className="sm:w-1/3">
                                        <strong>Name:</strong> {task.name}
                                    </div>
                                    <div className="sm:w-1/3">
                                        <strong>Date:</strong> {task.date}
                                    </div>
                                    <div className="sm:w-1/3">
                                        <strong>Description:</strong> {task.description}
                                    </div>
                                </div>
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleToggleComplete(task.id)}
                                className={`py-1 px-3 rounded-lg text-sm transition duration-300 ${task.completed ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                            >
                                {task.completed ? 'Completed' : 'Mark'}
                            </button>
                            <button
                                onClick={() => handleEditTask(task.id)}
                                className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 transition duration-300"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition duration-300"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {isEditing && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                    <input
                        type="text"
                        value={editTaskName}
                        onChange={(e) => setEditTaskName(e.target.value)}
                        className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="text"
                        value={editTaskDescription}
                        onChange={(e) => setEditTaskDescription(e.target.value)}
                        className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="date"
                        value={editTaskDate}
                        onChange={(e) => setEditTaskDate(e.target.value)}
                        className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleSaveEdit}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskList;
