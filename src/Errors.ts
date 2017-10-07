declare var DEBUG: boolean;
if (typeof DEBUG === 'undefined') {
  var DEBUG = true;
}

if (DEBUG) {
  var error_text_map: Object = {
    'schmnf': 'Scheme not found',
    'collnf': 'Collection not found',
    'collnf:s': 'Collection not found by singular name',
    'collex': 'Collection with name already exists in scheme',
    'elpgns': 'No scheme tags found',
    'elpnce': 'No collection or element tags found',
    'elndoc': 'No document',
    'confns': 'Configuration has no selector',
    'confnn': 'Configuration has no name',
    'elenew': 'Element is new',
    'elesna': 'Element has a selector value but is in new_elements array',
    'elense': 'Element has no selector value but is in elements object',
    'apinur': 'Api url has not yet been set',
    'fldnsa': 'Field should be an array of selectors',
    'elesch': 'Element selector changed',
    'elesnf': 'Snapshot not found',
    'elesti': 'Invalid snapshot identifier: must be number <= list.length, string or RegExp',
    'eleafw': 'Pre element has an associated field that does not match the embedded element selector',
    'elesnm': 'Selector is not matching get one request selector',
    'ajahct': 'Content-Type header not set to application/json',
    'acgtda': 'GET request can\'t have data. Use url_options.params'
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
