import { AjaxData, AjaxHeaders, AjaxPromise } from '../../Ajax';
import { ActionConfigurationMap, ActionConfiguration } from '../../Configuration';
import { Element } from '../../Element';
import { UrlOptions } from '../UrlHelper';
export interface ActionOptions {
    data?: AjaxData;
    headers?: AjaxHeaders;
    url_options?: UrlOptions;
}
export declare namespace Actions {
    function setup(element: Element, actions_config: ActionConfigurationMap): void;
    function execute(element: Element, method: string, action_options?: ActionOptions): AjaxPromise;
    function executeCustom(element: Element, action_name: string, action_config: ActionConfiguration, action_options?: ActionOptions): AjaxPromise;
}
