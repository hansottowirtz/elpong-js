import { FutureArrayConstructor } from './Interfaces';

module Elpong {
  export function log() {
    if ((Array as any as FutureArrayConstructor).from) {
      let arg_arr = (Array as any as FutureArrayConstructor).from(arguments);
      console.log.apply(console, ['%c Elpong ', 'background: #80CBC4; color: #fff'].concat(arg_arr));
    }
    else {
      console.log.apply(arguments);
    }
  }
}
