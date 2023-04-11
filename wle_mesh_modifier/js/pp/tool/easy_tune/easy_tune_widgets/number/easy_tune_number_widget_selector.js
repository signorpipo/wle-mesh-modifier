import { EasyTuneBaseArrayWidgetSelector } from "../base/easy_tune_base_array_widget_selector";
import { EasyTuneNumberArrayWidget } from "./easy_tune_number_array_widget";

export class EasyTuneNumberArrayWidgetSelector extends EasyTuneBaseArrayWidgetSelector {

    _getEasyTuneArrayWidget(arraySize) {
        return new EasyTuneNumberArrayWidget(this._myParams, arraySize, this._myGamepad, this._myEngine);
    }
}