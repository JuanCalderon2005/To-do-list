import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Task Manager</h1>
      <p className="text-lg mb-8 text-center">
        Manage your tasks efficiently and stay organized.
      </p>
      <Link href="/view-tasks">
        <button className="px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300">
          View Tasks
        </button>
      </Link>
    </div>
  );
}
