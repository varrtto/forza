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

const genders = [
  {
    value: "masculino",
    label: "Masculino",
  },
  {
    value: "femenino",
    label: "Femenino",
  },
  {
    value: "otro",
    label: "Otro",
  },
];

interface ComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Combobox({
  value: controlledValue,
  onValueChange,
  ...props
}: ComboboxProps &
  Omit<
    React.ComponentProps<typeof PopoverTrigger>,
    "value" | "onValueChange"
  >) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

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
            ? genders.find((gender) => gender.value === value)?.label
            : "Seleccionar género..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar género..." />
          <CommandList>
            <CommandEmpty>No género encontrado.</CommandEmpty>
            <CommandGroup>
              {genders?.map((gender) => (
                <CommandItem
                  key={gender.value}
                  value={gender.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    handleValueChange(newValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === gender.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {gender.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
