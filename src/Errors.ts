declare var DEBUG: boolean;
/* tslint:disable */ 
if (typeof DEBUG === 'undefined') {
  var DEBUG = true;
}
/* tslint:enable */

export const enum ElpongErrorType {
  SCHNFO,
  COLNFO,
  COLNFS,
  COLEXI,
  ELPNST,
  ELPNCE,
  ELPNDC,
  CNFNSL,
  CNFNNA,
  ELENEW,
  ELENNW,
  ELESNA,
  ELESNE,
  APINUR,
  FLDNSA,
  ELESCH,
  ELESNF,
  ELESTI,
  ELEAFW,
  ELESNM,
  ELENOS,
  AJXHCT,
  AJXGDA
}

let errorTextMap: { [key: number]: string };
if (DEBUG) {
  errorTextMap = {
    [ElpongErrorType.SCHNFO]: 'Scheme not found',
    [ElpongErrorType.COLNFO]: 'Collection not found',
    [ElpongErrorType.COLNFS]: 'Collection not found by singular name',
    [ElpongErrorType.COLEXI]: 'Collection with name already exists in scheme',
    [ElpongErrorType.ELPNST]: 'No scheme tags found',
    [ElpongErrorType.ELPNCE]: 'No collection or element tags found',
    [ElpongErrorType.ELPNDC]: 'No document',
    [ElpongErrorType.CNFNSL]: 'Configuration has no selector',
    [ElpongErrorType.CNFNNA]: 'Configuration has no name',
    [ElpongErrorType.ELENEW]: 'Element is new',
    [ElpongErrorType.ELENNW]: 'Element is not new',
    [ElpongErrorType.ELESNA]: 'Element has a selector value but is in new_elements array',
    [ElpongErrorType.COLNFS]: 'Element has no selector value but is in elements object',
    [ElpongErrorType.APINUR]: 'Api url has not yet been set',
    [ElpongErrorType.FLDNSA]: 'Field should be an array of selectors',
    [ElpongErrorType.ELESCH]: 'Element selector changed',
    [ElpongErrorType.ELESNF]: 'Snapshot not found',
    [ElpongErrorType.ELESTI]: 'Invalid snapshot identifier: must be number <= list.length, string or RegExp',
    [ElpongErrorType.ELEAFW]: 'Pre element has an reference field that does not match the embedded element selector',
    [ElpongErrorType.ELESNM]: 'Selector is not matching get one request selector',
    [ElpongErrorType.ELENOS]: 'No selector value given in getOne action',
    [ElpongErrorType.AJXHCT]: 'Content-Type header not set to application/json',
    [ElpongErrorType.AJXGDA]: 'GET request can\'t have data. Use params'
  };
}

export class ElpongError extends Error {
  constructor(message: ElpongErrorType, argument?: string) {
    const actualMessage = errorTextMap[message] ? errorTextMap[message] : `Error code ${message}`;
    if (argument) {
      super(`${actualMessage}: ${argument}`);
    } else {
      super(actualMessage);
    }
  }
}
