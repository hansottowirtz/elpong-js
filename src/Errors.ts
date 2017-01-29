declare var DEBUG: boolean;

module Elpong {
  if (typeof DEBUG !== 'undefined' && DEBUG) {
    var error_text_map: Object = {
      'schmnf': 'Scheme not found',
      'collnf': 'Collection not found',
      'collnf:s': 'Collection not found by singular name',
      'collex': 'Collection with name already exists in scheme',
      'elpgns': 'No schemes added or found',
      'confns': 'Configuration has no selector',
      'confnn': 'Configuration has no name',
      'elenew': 'Element is new',
      'elesna': 'Element has a selector value but is in new_elements array',
      'elense': 'Element has no selector value but is in elements object'
    }
  }

  export class ElpongError extends Error {
    constructor(message: string, argument?: string) {
      let actual_message = DEBUG ? error_text_map[message] : message;
      if (argument) {
        super(`${actual_message}: ${argument}`);
      }
      else {
        super(actual_message);
      }
    }
  }
}
