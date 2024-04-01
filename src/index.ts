import { merge } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { catchError, map, tap } from 'rxjs/operators';

const itFunction = global.it ?? global.test

/**
 * The test description
 */
type DescriptionString = string;

/**
 * A key-value map of ASCII characters representing stream events to use in tests
 */
type StreamMap = Record<string, unknown>;

/**
 * An ASCII-art string representing stream events in Marble notation,
 * using defined mappings
 */
type StreamASCII = string;
type StreamASCIIRecord = Record<string, StreamASCII>;
type TestType = Function & { only: Function; skip: Function; };

type mappings = {
  input?: StreamMap
  output: StreamMap
};

type SUT = Function;
type MappingsRecord = Record<string, unknown>;
type Stubs = unknown[];

type SpecData = {
  input?: StreamASCIIRecord;
  output?: StreamASCIIRecord;
  subscription?: StreamASCIIRecord;
  inputs?: StreamASCIIRecord;
  outputs?: StreamASCIIRecord;
  subscriptions?: StreamASCIIRecord;
};

const _test = (testType: TestType = itFunction, message: DescriptionString, SUT: SUT, stubs: Stubs, mappings: MappingsRecord, streams: SpecData) => {
  // const staticInputMap = Object.fromEntries(Object.entries(mappings.input).filter(([k, v]) => typeof v != 'function'));
  // const dynamicInputMap = Object.fromEntries(Object.entries(mappings.input ?? {}).filter(([k, v]) => typeof v == 'function'));

  // const createProxy = (target) => new Proxy(target, {
  //   get(target, prop, receiver) {
  //     if (prop in target) {
  //       const value = Reflect.get(target, prop, receiver);
  //       if(typeof value == 'function') {
  //         // if it's a function, call it
  //         return value(SUT);
  //       } else {
  //         return value;
  //       }
  //     } else {
  //       // if it's not mapped, just return itself
  //       return prop;
  //     }
  //   }
  // });
 
  testType(message, marbles(context => {
    const isSingleInput = !!streams.input && !streams.inputs;
    const isSingleOutput = !!streams.output && !Object.keys(streams.outputs || {}).length;
    
    const inputStrings:  Record<string, StreamASCII> = isSingleInput ? {default: streams.input} : streams.inputs;
    const outputStrings: Record<string, StreamASCII> = isSingleOutput ? {default: streams.output} : streams.outputs;

    const sources$   = Object.fromEntries(Object.entries(inputStrings).map(([k, v]) => [k, context.hot(v,   mappings.input)]));
    const expecteds$ = Object.fromEntries(Object.entries(outputStrings).map(([k, v]) => [k, context.cold(v, mappings.output)]));
    const outputs$ = isSingleOutput
      ? {}
      : Object.fromEntries(
          Object.keys(outputStrings)
            .map(k => [k, stubs[1][k]])
        )
    ;
          
    const SUTInstance = isSingleInput
      ? SUT(sources$.default)
      : SUT(sources$, outputs$)
    ;

    if(isSingleOutput) {
      context.expect(SUTInstance).toBeObservable(expecteds$.default);
    } else {
      Object.entries(outputs$).forEach(([k, output]) => {
        const expected = isSingleOutput ? SUTInstance : expecteds$[k];
        context.expect(output).toBeObservable(expected);
      });
    }

    // subscriptions.forEach((subscription, i) => {
    //   context.expect(sources[i]).toHaveSubscriptions(subscription);
    // });
  }));
};

const _it   = (...data: [DescriptionString, SUT, Stubs, MappingsRecord, SpecData]) => _test(it, ...data);
const _xit  = (...data: [DescriptionString, SUT, Stubs, MappingsRecord, SpecData]) => _test(xit, ...data);
const _skip = (...data: [DescriptionString, SUT, Stubs, MappingsRecord, SpecData]) => _test(it.skip, ...data);
const _only = (...data: [DescriptionString, SUT, Stubs, MappingsRecord, SpecData]) => _test(it.only, ...data);

_it.only = _only;
_it.skip = _skip;

export const observe = {
  it: _it,
  xit: _xit,
  skip: _skip,
  only: _only,
};

export default observe;
