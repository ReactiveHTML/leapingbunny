import type { MappingsRecord, SpecData, StreamASCII, StreamAssertionsRecord, char } from "./types";
import { isChar } from "./types";

type HandlersMap = Map<string, unknown>;

const parseSpecLine = (string: string, handlers: HandlersMap, spec: SpecData) => {
    // console.error('PARSE SPEC LINE', string);
    const expression = string?.match(/^\s*(?<key>\S*)\s*(?<operator><|>)\s*(?<value>.*)\s*$/);
    if(/^\s*$/.test(string)) {
        return
    } else if(!expression) {
        console.warn(`Invalid spec line: ${string}`);
        // throw new Error(`Invalid spec line: ${string}`);
    } else {
        const { key, operator, value } = expression?.groups;

        if(isChar(key)) {
            // Mapping
            // console.log('Set Mapping', key, operator, value);
            const handler = handlers.get(value) ?? value.replace(/^['"]/, '').replace(/['"]$/, '');
            spec.mappings[operator == '<' ? 'input' : 'output'].set(key, handler);
        } else if(key.match(/^\s*(###\d+###)\s*$/)) {
            // Stream definition
            const handlerId = RegExp.$1;
            const item = handlers.get(handlerId);
            const streamASCII: StreamASCII = value;
            spec.streamDefinitions[operator == '<' ? 'input' : 'output'].set(item, streamASCII);
        }
    }
}

export const parseSpecTemplate = (strings: TemplateStringsArray, ...args: unknown[]): SpecData => {
    const specData: SpecData = {
        mappings: <MappingsRecord>{
            input: new Map(),
            output: new Map(),
        },
        streamDefinitions: <StreamAssertionsRecord>{
            input:  new Map(),
            output: new Map(),
        },
    };
    let currentLine = '';
    let handlers: HandlersMap = new Map();
 
 	for(let i=0; i<strings.length; i++) {
		const string = strings[i];
		const maybeHandler: unknown = args[i];
        const key = maybeHandler ? `###${handlers.size}###` : '';
        maybeHandler && handlers.set(key, maybeHandler);
        currentLine += `${string}${key}`;
    };

    currentLine
        .split(/\n/)
        .filter(x=>x)
        .forEach(line => {
            parseSpecLine(line, handlers, specData);
        });
    return specData;
}

// import { Subject } from 'rxjs'
// const mock = 'mock'
// const stubs = {
//     btn1click: new Subject(),
//     btn2click: new Subject(),
//     effect1: new Subject(),
// }
// const SUT = (stubs) => new Subject()

// const data = parseSpecTemplate`
//       1 < ${ mock }
//       2 < ${ mock }
//       W > 'You win'
//       L > 'You lose'
//       ${stubs.btn1click} < --1----1-(  )
//       ${stubs.btn2click} < -----2---(2 )
//       ${stubs.effect1}   > --3--2-1-( |)
//       ${SUT(stubs)}      > ---------(W|)
//   `;

// console.log('-----------');
// console.log(data);