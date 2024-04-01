# Leaping Bunny
A JavaScript testing library for async Rimmel components and view-models.

No animals have been captured, tortured or killed to build this project.

## Motivation
People hate testing... unless it's efficient and fun. Particular emphasis goes to efficiency here.
This library is designed specifically to test Rimmel.js components - views and view-models - where
complex async logic is involved.

## Testing view-models
View-models in Rimmel are often plain in-out Observables (Rx Subjects, BehaviorSubjects),
which are best tested using Marbles.

This is how you can test a typical Rimmel.js view-model easily.

```js
import { observe } from 'leaping-bunny';
import SUT from './view-model.js';

const inputMap = {
  C: { type: 'click' }, // Map "C" to a DOM "ClickEvent"
};

const outputMap = {
};

describe('Click Counter', () => {
    
  describe('When the button is clicked', () => {
 
    observe.it('Emits the count of clicks', {
			SUT,
			inputMap,
			outputMap,
			input:        '---C---C--CC---C----(o|)', // Actions
			output:       '---1---2--34---5----(W|)', // Expectations
    });

  });

});

```

## Testing shallow-mounted components
WIP.
