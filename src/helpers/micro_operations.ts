export const OPERATION_ENUM = {
  PLUS: '+',
  MINUS: '-',
  TIMES: '*',
  DIVIDE: '/',
} as const;

export type OperationEnum = typeof OPERATION_ENUM[keyof typeof OPERATION_ENUM];

export const MICRO_OPERATOR = 1_000_000;

export const microOperation = (n1: number, n2: number, operation: OperationEnum) => {
    const microN1 = n1 * MICRO_OPERATOR;
    const microN2 = n2 * MICRO_OPERATOR;

    if (operation === OPERATION_ENUM.PLUS)
    {
        return (microN1 + microN2) / MICRO_OPERATOR;
    }
    else if (operation === OPERATION_ENUM.MINUS) {
        return (microN1 - microN2) / MICRO_OPERATOR;
    }
    else if (operation === OPERATION_ENUM.TIMES) {
        return (microN1 * microN2) / (MICRO_OPERATOR * MICRO_OPERATOR);
    }
    else if (operation === OPERATION_ENUM.DIVIDE) {
        if (microN2 === 0)
            return Infinity;
        return (microN1 / microN2);
    }
}
