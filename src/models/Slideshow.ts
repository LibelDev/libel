import EventEmitter from 'events';
import random from 'lodash/random';

export enum SlideshowEvent {
  Change = 'change'
}

export interface IChangeEvent {
  prevImage: HTMLElement;
  image: HTMLElement;
}

// interface ISlideshow extends EventEmitter {
//   emit: (type: SlideshowEvent.Change, event: IChangeEvent) => boolean;
//   on: (type: SlideshowEvent.Change, listener: (event: IChangeEvent) => void) => this;
// }

const _images = Symbol('images');
const _interval = Symbol('interval');

interface IOptions {
  container: HTMLElement;
  images: string[];
  render: (src: string) => HTMLElement;
}

class Slideshow extends EventEmitter {
  private [_images]: HTMLElement[] = [];
  private [_interval]!: number;
  private index!: number;

  constructor (options: IOptions) {
    super();
    this.init(options);
  }

  private init (options: IOptions) {
    const { container, images, render } = options;
    for (const src of images) {
      const image = render(src);
      this[_images].push(image);
      container.appendChild(image);
    }
  }

  private updateRandomIndex (): [number, number] {
    const { index } = this;
    const _index = random(0, this[_images].length - 1);
    if (_index === index) {
      return this.updateRandomIndex();
    }
    this.index = _index;
    return [index, _index];
  }

  private random () {
    const [prevIndex, index] = this.updateRandomIndex();
    this.triggerChange(prevIndex, index);
  }

  private update = () => {
    this.random();
  };

  private triggerChange (prevIndex: number, index: number) {
    const prevImage = this[_images][prevIndex];
    const image = this[_images][index];
    this.emit(SlideshowEvent.Change, { prevImage, image });
  }

  start (timeout: number) {
    if (this[_interval]) {
      window.clearInterval(this[_interval]);
    }
    this[_interval] = window.setInterval(this.update, timeout);
    this.update();
  }
}

export default Slideshow;
