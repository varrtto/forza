// Centralized types for the Forza application

export interface Exercise {
  id: string;
  name: string;
  series: number;
  reps: number[];
  weight: number[];
  details: string;
}

export interface MuscleGroup {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Day {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
}

export interface Routine {
  id: string;
  name: string;
  studentId?: string;
  days: Day[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  created_at: string;
  updated_at: string;
  routines?: Routine[];
}

export interface RoutineWithStudent {
  id: string;
  name: string;
  routine_data: Routine;
  created_at: string;
  updated_at: string;
  students: {
    id: string;
    name: string;
  };
}

export interface StudentWithRoutines extends Omit<Student, "routines"> {
  routines: Array<{
    id: string;
    name: string;
    routine_data: Routine;
    created_at: string;
    updated_at: string;
  }>;
}

// API Response types
export interface StudentsResponse {
  students: Student[];
}

export interface StudentResponse {
  student: StudentWithRoutines;
}

export interface RoutinesResponse {
  routines: RoutineWithStudent[];
}

export interface RoutineResponse {
  routine: RoutineWithStudent;
}

// Form types
export interface AddStudentFormData {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
}

export interface CreateRoutineData {
  studentId: string;
  routineData: Routine;
}
