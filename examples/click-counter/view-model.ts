import { every,map } from 'rxjs/operators';

const secret = 'hello'

const easterEgg = (input) => input.pipe(
  map(e => e.key),
  every((value, index) => value === secret.charAt(index)),
  map(matches => (matches ? 'You win' : 'You lose')),
);

export default easterEgg;
