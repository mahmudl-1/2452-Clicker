import {expect, test} from 'vitest';
import {assert} from '../../src/model/Assertions'
import { AssertionError } from '../../src/model/Assertions';

test('assert should throw an error when the condition is false', () => {
    expect(() => assert(false, "This is an expected failure message.")).toThrow(AssertionError);
});