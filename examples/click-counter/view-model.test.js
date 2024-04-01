import { describe, test } from 'vitest';
global.it = test;

import { observe } from '../index.js';
import SUT from './view-model.js';

const inputMap = {
  M: { type: 'click' }, // Map "M" input to a mouse click event

  h: { key: 'h', type: 'keydown' }, // Map "h" input to a "h" keydown event
  e: { key: 'e', type: 'keydown' }, // Map "e" input to a "e" keydown event
  l: { key: 'l', type: 'keydown' }, // Map "l" input to a "l" keydown event
  o: { key: 'o', type: 'keydown' }, // Map "o" input to a "o" keydown event
};

const outputMap = {
  W: 'You win',  // Map "W" output to a "You Win" message
  L: 'You lose', // Map "L" output to a "You lose" message
};

describe('Game', () => {
  describe('When sending the correct sequence', () => {
    observe.it('Win', {
      SUT,
      inputMap,
      outputMap,
      input:        '----------h--el----l----(o|)',
      subscription: '^-----------------------( !)',
      output:       '------------------------(W|)',
    });
  });

  describe('When sending just a wrong sequence', () => {
    observe.it('Lose', {
      SUT,
      inputMap,
      outputMap,
      input:        '----(M )-hell------o---|----',
      subscription: '^---( !)--------------------',
      output:       '----(L|)--------------------',
    });
  });
});
