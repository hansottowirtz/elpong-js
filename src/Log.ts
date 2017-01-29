module Elpong {
  export function log() {
    if ((Array as any as ApproximatedFutureArrayConstructor).from) {
      let arg_arr = (Array as any as ApproximatedFutureArrayConstructor).from(arguments);
      console.log.apply(console, ['%c HTTPong ', 'background: #80CBC4; color: #fff'].concat(arg_arr));
    }
    else {
      console.log.apply(arguments);
    }
  }
}
