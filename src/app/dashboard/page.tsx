import { StudentsList } from "@/features/studentsList";

export default function Dashboard() {
  return (
    <div className="gym-floor flex h-[calc(100dvh-72px)] max-h-[calc(100dvh-72px)] min-h-0 flex-col overflow-hidden">
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden px-4 md:px-8">
        <StudentsList />
      </div>
    </div>
  );
}
