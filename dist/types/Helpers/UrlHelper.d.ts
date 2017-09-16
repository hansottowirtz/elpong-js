import { ActionConfiguration } from '../Configuration';
import { Element } from '../Element';
import { Collection } from '../Collection';
export interface UrlOptions {
    path?: string;
    suffix?: string;
}
export declare namespace UrlHelper {
    function createForElement(action_name: string, action_configuration: ActionConfiguration, element: Element, url_options: UrlOptions, no_selector?: boolean): string;
    function createForCollection(action_name: string, collection: Collection, url_options: UrlOptions): string;
    function trimSlashes(s: string): string;
    function isFqdn(s: string): boolean;
}
