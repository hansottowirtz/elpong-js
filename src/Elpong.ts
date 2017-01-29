module Elpong {
  declare let DEBUG: boolean;

  interface SchemeMap {
    [name: string]: Scheme;
  }
  
  interface CollectionMap {
    [name: string]: Collection;
  }

  let schemes: SchemeMap = {};

  export const ElpongStatic = {
    addScheme: (scheme_configuration: SchemeConfiguration) => {
      let scheme = new Scheme(scheme_configuration);
      schemes[scheme.name] = scheme;
    },

    scheme: (name: string) => {
      let scheme: Scheme;
      if (scheme = schemes[name]) {
        return scheme;
      }
      throw new ElpongError('schmnf', name); // Scheme not found
    },

    load: () => {
      let scheme_tags: NodeListOf<HTMLMetaElement> =
        document.querySelectorAll('meta[name=httpong-scheme]') as NodeListOf<HTMLMetaElement>;

      if (!scheme_tags.length && !Object.keys(schemes).length) {
        throw new ElpongError('elpgns');
      }

      for (let scheme_tag of Util.arrayFromHTML(scheme_tags) as HTMLMetaElement[]) {
        ElpongStatic.addScheme(JSON.parse(scheme_tag.content));
      }

      // TODO: load preloaded elements

      return ElpongStatic;
    }
  }
}
