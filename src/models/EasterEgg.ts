type THandler = () => void;

class EasterEgg {
  private handler: THandler;

  constructor (handler: THandler) {
    this.handler = handler;
  }

  hatch () {
    const { handler } = this;
    handler();
  }
}

export default EasterEgg;
