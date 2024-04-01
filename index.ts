import { marbles } from 'rxjs-marbles';

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

type TestType = Function & { only: Function; skip: Function; };

type SpecData = {SUT, inputMap: StreamMap, outputMap: StreamMap, input: StreamASCII, subscription?: StreamASCII, output: StreamASCII}

const _test = (type: TestType = it, message: DescriptionString, {SUT, inputMap, outputMap, input, subscription, output}: SpecData) => {
  type(message, marbles(m => {
    const source = m.hot(input, inputMap);
    const expected = m.cold(output, outputMap);

    m.expect(SUT(source)).toBeObservable(expected);
    subscription && m.expect(source).toHaveSubscriptions(subscription);
  }));
};

const _it = (...data: [DescriptionString, SpecData]) => _test(it, ...data);
const _xit = (...data: [DescriptionString, SpecData]) => _test(xit, ...data);
const _skip = (...data: [DescriptionString, SpecData]) => _test(it.skip, ...data);
const _only = (...data: [DescriptionString, SpecData]) => _test(it.only, ...data);

_it.only = _only;
_it.skip = _skip;

export const observe = {
  it: _it,
  xit: _xit,
  skip: _skip,
  only: _only,
};

export default observe;
