import { CONVERSIONS } from "../constants";
import { microOperation, OPERATION_ENUM } from "./micro_operations";

export const convertValue = (
  inputValue: number | string,
  inputUnit: string,
  outputUnit: string,
  outputPrecision?: number
) => {
  if (inputValue === "" || isNaN(Number(inputValue))) {
    return "";
  }

  const value = Number(inputValue);
  const inputUnitToSerach = inputUnit
  const outputUnitToSerach = outputUnit
  const inputObj = CONVERSIONS.find(u => u.abbv === inputUnitToSerach);
  const outputObj = CONVERSIONS.find(u => u.abbv === outputUnitToSerach);

  if (!inputObj || !outputObj || inputObj.category !== outputObj.category) {
    return "";
  }

  const inputInBase = microOperation(inputObj.conv_rate, value, OPERATION_ENUM.TIMES);
  const output = microOperation(inputInBase ?? 0, outputObj.conv_rate, OPERATION_ENUM.DIVIDE);

  return outputPrecision ? output ? output.toFixed(outputPrecision) : "0" : output;
};
