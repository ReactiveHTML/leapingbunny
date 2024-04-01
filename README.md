# LeapingBunny.js
A zero-animal-cruelty JavaScript testing library for async components, observable states and view-models.
Based on rx-marbles, it dramatically simplifies setting up unit tests for observable streams.

![Leaping Bunny](./leaping-bunny.png)

## Motivation
People don't like writing tests... unless it's efficient and fun. If it's not fun, the result is awful and clients are unhappy. If it's not efficient but people have fun writing them, it's a business tragedy.
This is especially true when complex UI and async interaction is involved, where each single unit test can get notoriously long to write and  maintain.

Leaping Bunny is designed to help testing Rimmel.js components, views and view-models where complex or async logic is involved.

## Testing observable states / view-models
View-models in [Rimmel.js](https://github.com/hellomenu/rimmel) are often plain in-out Observables (Rx Subjects, BehaviorSubjects, etc),
which are best tested using with ASCII-art and Rx Marbles.

This is how easy becomes to test a component's view-model, where you click a button and it counts your clicks.

```js
import { observe } from 'leaping-bunny';
import viewModel from './view-model.js';

const mappings = {
  input: {
    C: { type: 'click' }, // Map "C" to a DOM "ClickEvent", which will be fed into the view-model
  },
  output: {
  }
};

describe('Click Counter', () => {
  describe('When the button is clicked', () => {

    observe.it('Emit a count of clicks', viewModel, mappings, {
      input:  '---C---C--CC---C---', // Actions (C = button is clicked)
      output: '---1---2--34---5---', // Expectations (1, 2, 3 is the output emitted each time)
    });

  });
});

```

## Testing more complex state / view-models
If your state combines multiple input and/or emits multiple output streams, the easiest way is to wrap your view-model in the Rimmel.js view-model format:

```js
  const multiStreaamViewModel = ([inputs, outputs]) => {
    const { input1, input2 } = inputs;
    const { output1, output2 } = outputs;

    // Business logic goes here.
    // Process input1 and input2, emit output1, output2
  }
```

This way your view-models can have an unlimited number of input and output streams, and are ready to be testen in very simple way.
For instance, take a hypothetical view-model for a UI with two buttons you have to click, alternatively, 5 times each. If you do,
you'll get a "You win" message in output, otherwise a "You lose".

```js
// multi-stream-view-model.test.js
import { observe } from 'leaping-bunny';
import multiStreamViewModel from './multi-stream-view-model.js';

const mappings = {
  input: {
    C: { type: 'click' }, // Map "C" to a DOM "ClickEvent", which will be fed into the view-model
  },
  output: {
    W: 'You win',  // Map "W" to a mnemonic for "You win"
    L: 'You lose', // Map "L" to a mnemonic for "You lose"
  }
};

describe('Alternate clicks', () => {
  describe('When the buttons are clicked 10 times, alternatively', () => {

    observe.it('Emit a "You win" message', viewModel, mappings, {
      inputs: {
        input1: '---C---C--C--C---C-----', // Actions (C = button is clicked)
        input2: '-----C---C--C--C---C---', // Actions (C = button is clicked)
      },
      outputs: {
        output1: '------------------W---', // Expectations. W when the last button is clicked.
      }
    });

  });
});
```

In the test above we're making sure that when `input1` and `input2` receive exacly 5 clicks, alternatively, then `output1` emits "You win".
Want to test if you start with the second button instead? Trivial.
```js
    observe.it('Second button first, then emit a "You win" message', viewModel, mappings, {
      inputs: {
        input1: '-----C---C--C-C----C-', // Actions (C = button is clicked)
        input2: '-C-----C--C--C---C---', // Actions (C = button is clicked)
      },
      outputs: {
        output1: '------------------W-', // Expectations. W when the last button is clicked.
      }
    });
```

So, what about other cases, when the alternative sequence is not respected?
```js
    observe.it('Second button first, then emit a "You win" message', viewModel, mappings, {
      inputs: {
        input1: '--C--C------C-C----C-', // Actions (C = button is clicked)
        input2: '-C-----CCCC--C---C---', // Actions (C = button is clicked)
      },
      outputs: {
        output1: '----L---------------', // Expectations. L when the first wrong button is clicked.
      }
    });
```

In this case, we expect `output1` to notify as soon as the first wrong button is clicked.

