"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import { useState } from "react";

const studentsData = [
  {
    id: 1,
    name: "Juan Perez",
    age: 20,
    gender: "Masculino",
    height: 180,
    weight: 70,
    email: "juan.perez@gmail.com",
    phone: "1234567890",
  },
  {
    id: 2,
    name: "Maria Gomez",
    age: 25,
    gender: "Femenino",
    height: 160,
    weight: 50,
    email: "maria.gomez@gmail.com",
    phone: "1234567890",
  },
  {
    id: 3,
    name: "Pedro Rodriguez",
    age: 30,
    gender: "Masculino",
    height: 170,
    weight: 75,
    email: "pedro.rodriguez@gmail.com",
    phone: "1234567890",
  },
];

const columns = [
  {
    header: "Nombre",
    accessorKey: "name",
  },

  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Teléfono",
    accessorKey: "phone",
  },
];

export const StudentsTable = () => {
  const [students, setStudents] = useState(studentsData);

  const handleDelete = (id: number) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <Table>
      <TableHeader>
        {columns.map((column) => (
          <TableHead key={column.accessorKey}>{column.header}</TableHead>
        ))}
      </TableHeader>
      <TableCaption>Lista de alumnos</TableCaption>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.phone}</TableCell>
            <TableCell>
              <Trash
                size={18}
                onClick={() => handleDelete(student.id)}
                className="cursor-pointer"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
