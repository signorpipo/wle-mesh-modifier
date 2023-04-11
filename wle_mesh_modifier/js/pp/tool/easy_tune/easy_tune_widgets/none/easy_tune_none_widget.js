import { getMainEngine } from "../../../../cauldron/wl/engine_globals";
import { EasyTuneBaseWidget } from "../base/easy_tune_base_widget";
import { EasyTuneNoneWidgetConfig } from "./easy_tune_none_widget_config";
import { EasyTuneNoneWidgetUI } from "./easy_tune_none_widget_ui";

export class EasyTuneNoneWidget extends EasyTuneBaseWidget {

    constructor(params, engine = getMainEngine()) {
        super(params);

        this._myConfig = new EasyTuneNoneWidgetConfig();
        this._myUI = new EasyTuneNoneWidgetUI(engine);
    }
}