"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const days = [
  {
    value: "lunes",
    label: "Lunes",
  },
  {
    value: "martes",
    label: "Martes",
  },
  {
    value: "miercoles",
    label: "Miercoles",
  },
  {
    value: "jueves",
    label: "Jueves",
  },
  {
    value: "viernes",
    label: "Viernes",
  },
  {
    value: "sabado",
    label: "Sabado",
  },
  {
    value: "domingo",
    label: "Domingo",
  },
];

export function Combobox({
  ...props
}: React.ComponentProps<typeof PopoverTrigger>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          {...props}
        >
          {value
            ? days.find((day) => day.value === value)?.label
            : "Select day..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {days?.map((day) => (
                <CommandItem
                  key={day.value}
                  value={day.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === day.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {day.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
