import { useCallback } from "react";
import { useMeasureConversionStore } from "./store";
import type { ConverterInput, ConverterOutput } from "./type";

const DEFAULT_INPUT: ConverterInput = { value: "", unit: "" };
const DEFAULT_OUTPUT: ConverterOutput = { unit: "", precision: 3 };

// List
export const useConverters = () =>
  useMeasureConversionStore((s) => s.converters);

// Take full converter
export const useConverter = (id: string) =>
  useMeasureConversionStore(
    useCallback(
      (s) => s.converters.find((c) => c.id === id) ?? null,
      [id]
    )
  );

// Straight Actions
export const useAddConverter = () =>
  useMeasureConversionStore((s) => s.addConverter);

export const useRemoveConverter = () =>
  useMeasureConversionStore((s) => s.removeConverter);

export const useUpdateConverter = () =>
  useMeasureConversionStore((s) => s.updateConverter);

// Input
export const useConverterInput = (id: string) =>
  useMeasureConversionStore(
    useCallback((s) => {
      const conv = s.converters.find((c) => c.id === id);
      return conv?.input ?? DEFAULT_INPUT;
    }, [id])
  );

// Stable Setter
export const useSetConverterInput = () => 
  useMeasureConversionStore((s) => s.setConverterInput);

// Output
export const useConverterOutput = (id: string) =>
  useMeasureConversionStore(
    useCallback((s) => {
      const conv = s.converters.find((c) => c.id === id);
      return conv?.output ?? DEFAULT_OUTPUT;
    }, [id])
  );

export const useSetConverterOutput = () =>
  useMeasureConversionStore((s) => s.setConverterOutput);

// Position
export const useSetConverterPosition = () =>
  useMeasureConversionStore((s) => s.setConverterPosition);
