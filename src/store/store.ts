import { create } from "zustand";
import type { MeasureConversionStore, ConverterState } from "./type";

const genId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const defaultConverter = (over?: Partial<ConverterState>): ConverterState => ({
  id: genId(),
  input: { value: "", unit: "" },
  output: { unit: "", precision: 3 },
  isDevMode: false,
  position: { x: 100, y: 100 },
  ...over,
});

export const useMeasureConversionStore = create<MeasureConversionStore>()((set) => ({
  converters: [defaultConverter()],

addConverter: (initial) => {
  let newConv: ConverterState;

  set((state) => {
    const offset = state.converters.length * 40;

    newConv = defaultConverter({
      ...initial,
      position: {
        x: 100 + offset,
        y: 100 + offset,
      },
    });

    return { converters: [...state.converters, newConv] };
  });

  return newConv!.id;
},



  removeConverter: (id) => {
    set((state) => ({ converters: state.converters.filter((c) => c.id !== id) }));
  },

  updateConverter: (id, patch) => {
    set((state) => ({
      converters: state.converters.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  },

  setConverterInput: (id, inputPatch) => {
    set((state) => ({
      converters: state.converters.map((c) =>
        c.id === id ? { ...c, input: { ...c.input, ...inputPatch } } : c
      ),
    }));
  },

  setConverterOutput: (id, outputPatch) => {
    set((state) => ({
      converters: state.converters.map((c) =>
        c.id === id ? { ...c, output: { ...c.output, ...outputPatch } } : c
      ),
    }));
  },

  setConverterPosition: (id, pos) => {
    set((state) => ({
      converters: state.converters.map((c) => (c.id === id ? { ...c, position: pos } : c)),
    }));
  },
}));
