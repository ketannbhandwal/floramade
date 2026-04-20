import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function Loading() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Loading...</h2>
      <LoadingSkeleton rows={6} />
    </div>
  );
}
