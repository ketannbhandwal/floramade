"use client";

export default function Error({ error, reset }) {
  return (
    <div className="rounded-xl bg-red-50 p-6">
      <h2 className="text-2xl font-semibold text-red-700">Something went wrong</h2>
      <p className="my-3 text-red-600">{error?.message}</p>
      <button onClick={reset} className="rounded bg-red-600 px-4 py-2 text-white">
        Try again
      </button>
    </div>
  );
}
