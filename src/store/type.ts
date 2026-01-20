export type ConverterInput = {
  value: number | string;
  unit: string;
};

export type ConverterOutput = {
  unit: string;
  precision: number;
};

export type ConverterState = {
  id: string;
  input: ConverterInput;
  output: ConverterOutput;
  isDevMode: boolean;
  position?: { x: number; y: number };
};

export type MeasureConversionStore = {
  converters: ConverterState[];

  addConverter: (initial?: Partial<ConverterState>) => string;
  removeConverter: (id: string) => void;
  updateConverter: (id: string, patch: Partial<ConverterState>) => void;

  setConverterInput: (id: string, inputPatch: Partial<ConverterInput>) => void;
  setConverterOutput: (id: string, outputPatch: Partial<ConverterOutput>) => void;
  setConverterPosition: (id: string, pos: { x: number; y: number }) => void;
};
