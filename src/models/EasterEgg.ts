import { debugEgg } from '../../config/config';

type THatch = () => void;

const _hatch = Symbol('hatch');

class EasterEgg {
  private readonly [_hatch]: THatch;

  constructor (
    hatch: THatch,
    private enabled: boolean
  ) {
    this[_hatch] = hatch;
  }

  hatch () {
    const { enabled } = this;
    if (debugEgg || enabled) {
      this[_hatch]();
    }
  }
}

export default EasterEgg;
