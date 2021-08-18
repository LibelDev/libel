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

class Slideshow extends EventEmitter {
  private [_images]: HTMLElement[] = [];
  private [_interval]: number | null = null;
  private images: string[];
  private index!: number;

  constructor (images: string[]) {
    super();
    this.images = images;
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

  private updateRandomIndex (): [number, number] {
    const { images, index } = this;
    const _index = random(0, images.length - 1);
    if (_index === index) {
      return this.updateRandomIndex();
    }
    this.index = _index;
    return [index, _index];
  }

  render (container: HTMLElement, render: (src: string) => HTMLElement) {
    this[_images] = [];
    const { images } = this;
    for (let i = 0; i < images.length; i++) {
      const src = images[i];
      const image = render(src);
      container.appendChild(image);
      this[_images][i] = image;
    }
  }

  start (timeout: number) {
    this.stop();
    this[_interval] = window.setInterval(this.update, timeout);
    this.update();
  }

  stop () {
    const { [_interval]: interval } = this;
    if (interval) {
      window.clearInterval(interval);
      this[_interval] = null;
    }
  }
}

export default Slideshow;
