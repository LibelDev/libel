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

type ImageRenderer = (src: string) => HTMLElement;

const _imageElements = Symbol('imageElements');
const _interval = Symbol('interval');

class Slideshow extends EventEmitter {
  private [_imageElements]: HTMLElement[] = [];
  private [_interval]: number | null = null;
  private index!: number;

  constructor (images: string[], render: ImageRenderer) {
    super();
    for (const src of images) {
      const imageElement = render(src);
      this[_imageElements].push(imageElement);
    }
  }

  private random () {
    const [prevIndex, index] = this.updateRandomIndex();
    this.triggerChange(prevIndex, index);
  }

  private update = () => {
    this.random();
  };

  private triggerChange (prevIndex: number, index: number) {
    const prevImage = this[_imageElements][prevIndex];
    const image = this[_imageElements][index];
    this.emit(SlideshowEvent.Change, { prevImage, image });
  }

  private updateRandomIndex (): [number, number] {
    const { index } = this;
    const { length } = this[_imageElements];
    const _index = random(0, length - 1);
    if (_index === index) {
      return this.updateRandomIndex();
    }
    this.index = _index;
    return [index, _index];
  }

  render (container: HTMLElement) {
    for (const image of this[_imageElements]) {
      container.appendChild(image);
    }
    return this;
  }

  start (timeout: number) {
    this.stop();
    this[_interval] = window.setInterval(this.update, timeout);
    this.update();
    return this;
  }

  stop () {
    const { [_interval]: interval } = this;
    if (interval) {
      window.clearInterval(interval);
      this[_interval] = null;
    }
    return this;
  }
}

export default Slideshow;
