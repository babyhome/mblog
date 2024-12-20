import { NextRequest, NextResponse } from "next/server";

type Job = {
    id?: string;
    message: string;
};
let todoList: Job[] = [];
let count = 0;

// Query
export async function GET(request: NextRequest): Promise<any> {
    const url = new URL(request.url);

    const action = url.searchParams.get("action");
    if (action == "reset") {
        todoList = [];
    }

    return NextResponse.json(todoList);
}

// Insert
export async function POST(request: NextRequest): Promise<any> {
    const { message }: Job = await request.json();

    console.log('x', message);
    count++;
    todoList = [...todoList, {id: count.toString(), message}];
    return NextResponse.json({ result: "ok" });
}
