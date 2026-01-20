import {describe, it, expect} from 'vitest'
import { microOperation, OPERATION_ENUM } from './micro_operations'


describe('Group of tests for "helpers/micro_operations"', () => {
    it('should add numbers correctly', () => {
        const n1 = 12.57
        const n2 = 23.43
        const result1 = microOperation(n1, n2, OPERATION_ENUM.PLUS)

        expect(result1).toBe(36)

        const n3 = 0.1
        const n4 = 0.2
        const result2 = microOperation(n3, n4, OPERATION_ENUM.PLUS)

        expect(result2).toBe(0.3)
    })

    it('should subtract numbers correctly', () => {
        const n1 = 50.75;
        const n2 = 25.25;
        const result1 = microOperation(n1, n2, OPERATION_ENUM.MINUS);
        expect(result1).toBe(25.5);

        const n3 = 0.3;
        const n4 = 0.1;
        const result2 = microOperation(n3, n4, OPERATION_ENUM.MINUS);
        expect(result2).toBe(0.2);
    });

    it('should multiply numbers correctly', () => {
        const n1 = 3.5;
        const n2 = 2;
        const result1 = microOperation(n1, n2, OPERATION_ENUM.TIMES);
        expect(result1).toBe(7);

        const n3 = 0.2;
        const n4 = 0.1;
        const result2 = microOperation(n3, n4, OPERATION_ENUM.TIMES);
        expect(result2).toBe(0.02);
    });

    it('should divide numbers correctly', () => {
        const n1 = 10.5;
        const n2 = 2.1;
        const result1 = microOperation(n1, n2, OPERATION_ENUM.DIVIDE);
        expect(result1).toBe(5);

        const n3 = 0.3;
        const n4 = 0.1;
        const result2 = microOperation(n3, n4, OPERATION_ENUM.DIVIDE);
        expect(result2).toBe(3);
    });

    it('should handle negative numbers', () => {
        const n1 = -5.5;
        const n2 = 2.5;
        const sum = microOperation(n1, n2, OPERATION_ENUM.PLUS);
        expect(sum).toBe(-3);

        const diff = microOperation(n1, n2, OPERATION_ENUM.MINUS);
        expect(diff).toBe(-8);

        const prod = microOperation(n1, n2, OPERATION_ENUM.TIMES);
        expect(prod).toBe(-13.75);

        const div = microOperation(n1, n2, OPERATION_ENUM.DIVIDE);
        expect(div).toBeCloseTo(-2.2, 5);
    });
})