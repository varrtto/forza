import { StudentsList } from "@/features/studentsList";

export default function Home() {
  return (
    <div className="flex flex-col font-sans min-h-screen items-center justify-items-center pt-10 gap-4">
      <div className="w-full max-w-6xl px-4">
        <StudentsList />
      </div>
    </div>
  );
}
