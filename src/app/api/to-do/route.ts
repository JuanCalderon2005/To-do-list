import { NextResponse } from 'next/server';

export interface Task {
    id: number;
    name: string;
    date: string;
    description: string;
    completed: boolean;
}

let tasks: Task[] = [];

export async function GET(req: Request) {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    let filterTasks = tasks;

    if (!status || status === 'all') {
        return NextResponse.json(tasks);
    }

    if (status === 'completed') {
        filterTasks = tasks.filter(task => task.completed);
    } else if (status === 'pending') {
        filterTasks = tasks.filter(task => !task.completed);
    }

    return NextResponse.json(filterTasks);
}

export async function POST(req: Request) {
    const body = await req.json();
    const task: Task = {
        id: tasks.length + 1,
        name: body.name,
        date: body.date,
        description: body.description,
        completed: body.completed
    };

    tasks.push(task);

    return NextResponse.json(task);
}

export async function PUT(req: Request) {
    const body = await req.json();
    const task = tasks.find(task => task.id === body.id);

    if (!task) {
        return NextResponse.json('Task not found', { status: 404 });
    }

    task.name = body.name;
    task.date = body.date;
    task.description = body.description;
    task.completed = body.completed;

    return NextResponse.json(task);
}

export async function DELETE(req: Request) {
    const body = await req.json();
    const taskIndex = tasks.findIndex(task => task.id === body.id);

    if (taskIndex === -1) {
        return NextResponse.json('Task not found', { status: 404 });
    }

    tasks.splice(taskIndex, 1);

    return NextResponse.json('Task deleted');
}

