import { TestObservableLike } from 'rxjs-marbles/types';

/**
 * The test description
 */
export type DescriptionString = string;

export type char = string & { _char: never; };
export const isChar = (c: unknown): c is char => typeof c === 'string' && c.length == 1;
/**
 * A key-value map of ASCII characters representing stream events to use in tests
 */
type StreamMap = Record<string, unknown>;

/**
 * An ASCII-art string representing stream events in Marble notation,
 * using defined mappings
 */
export type StreamASCII = string;

type StreamASCIIRecord = Record<string, StreamASCII>;

export type TestType = Function & { only: Function; skip: Function; };

type mappings = {
  input?: StreamMap;
  output: StreamMap;
};
export type SUT = Function;

export type UnifiedMappingsMap = Map<string, unknown>;
export type MappingsRecord = Record<'input' | 'output', UnifiedMappingsMap>;

export type StreamAssertionsMap = Map<TestObservableLike<unknown>, StreamASCII>;
export type StreamAssertionsRecord = Record<'input' | 'output', StreamAssertionsMap>;

export type Stubs = unknown[];

export type SpecData = {
  mappings: MappingsRecord;
  streamDefinitions: StreamAssertionsRecord;
};

export type SpecTemplate = string & { _template: never; }