import { marbles } from 'rxjs-marbles';
import type { TestType, DescriptionString, SUT, Stubs, UnifiedMappingsMap, SpecData, StreamASCII, MappingsRecord } from './types';
import { parseSpecTemplate } from './spec-parser';
import { tap } from 'rxjs/operators';

const itFunction = global.it ?? global.test
const isMappings = (x: object): x is MappingsRecord => 'input' in x && 'output' in x;

const _test = (testType: TestType = itFunction, message: DescriptionString, ...specData: [SpecData] | [MappingsRecord, SpecData]) => {
  // const spec = parseSpecTemplate(specData);

  const hasExternalMappings = isMappings(specData[0]);
  const spec = hasExternalMappings ? specData[1] : specData[0]; // = parseSpecTemplate(specData);
  // console.error('>>>>>>>>>>>>>>>>>>>', spec)
  const mappings = hasExternalMappings ? specData[0] : spec.mappings; // = parseSpecTemplate(specData);
  const inputMappingsObject = hasExternalMappings ? mappings.input : Object.fromEntries(mappings.input);
  const outputMappingsObject = hasExternalMappings ? mappings.output : Object.fromEntries(mappings.output);



  testType(message, marbles(context => {
    for(const [stream, inputASCII] of spec.streamDefinitions.input) {
      // console.error('creating hot', inputASCII, mappings.input)

      context.hot(inputASCII, inputMappingsObject)
        // .pipe(tap(x=>console.error('@@@@@@@@ piping hot', x)))
        .subscribe(stream);
    }


    for(const [stream, outputASCII] of spec.streamDefinitions.output) {
      const expected = context.cold(outputASCII, outputMappingsObject);
      context.expect(stream).toBeObservable(expected);
    }

    // subscriptions.forEach((subscription, i) => {
    //   context.expect(sources[i]).toHaveSubscriptions(subscription);
    // });
  }));
};

const _it   = (...data: [DescriptionString, SpecData]) => _test(it, ...data);
const _xit  = (...data: [DescriptionString, SpecData]) => _test(xit, ...data);
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

observe.how = observe;

export const bunny = parseSpecTemplate;
export default observe;


// // --------------------------------------------------
// import { Subject } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { merge } from 'rxjs';
// import { every, map, tap } from 'rxjs/operators';

// const secret = 'hello'

// export const easterEgg1 = input => input.pipe(
//   map(e => e.key),
//   every((value, index) => value === secret.charAt(index)),
//   map(matches => (matches ? 'You win' : 'You lose')),
// );
// function it (message, specData) {
//   console.error('SSSSSPD', specData)
//   debugger;
//   specData();
// }
// // -----------

// const stubs = {
//   input: new Subject().pipe(tap(x=>console.log('<<<', x))),
//   output: new Subject(),
// }

//   debugger;

//     observe.it('Wins', bunny`
//       M < ${ { type: 'click' } }

//       h < ${ { key: 'h', type: 'keydown' } }
//       e < ${ { key: 'e', type: 'keydown' } }
//       l < ${ { key: 'l', type: 'keydown' } }
//       o < ${ { key: 'o', type: 'keydown' } }
//       W > 'You win'
//       L > 'You lose'

//       ${stubs.input}             < ----------h--el----l----(o|)
//       ${easterEgg1(stubs.input)} > ------------------------(W|)
//     `);
