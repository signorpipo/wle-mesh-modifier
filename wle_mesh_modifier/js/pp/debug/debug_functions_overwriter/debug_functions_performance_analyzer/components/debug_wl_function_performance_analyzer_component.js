import { Component, Property } from "@wonderlandengine/api";
import { DebugFunctionsPerformanceAnalyzerComponent } from "./debug_functions_performance_analyzer_component";

export class DebugWLFunctionsPerformanceAnalyzerComponent extends Component {
    static TypeName = "pp-debug-wl-functions-performance-analyzer";
    static Properties = {
        _myDelayStart: Property.float(0.0),
        _myLogFunction: Property.enum(["Log", "Error", "Warn", "Debug"], "Log"),
        _mySecondsBetweenLogs: Property.float(1.0),
        _myLogMaxResults: Property.bool(false),
        _myLogSortOrder: Property.enum(["None", "Calls Count", "Total Execution Time", "Average Execution Time"], "None"),
        _myLogCallsCountResults: Property.bool(true),
        _myLogTotalExecutionTimeResults: Property.bool(true),
        _myLogTotalExecutionTimePercentageResults: Property.bool(true),
        _myLogAverageExecutionTimeResults: Property.bool(true),
        _myLogMaxAmountOfFunctions: Property.int(-1),
        _myLogFunctionsWithCallsCountAbove: Property.int(-1),
        _myLogFunctionsWithTotalExecutionTimePercentageAbove: Property.float(-1),
        _myFunctionPathsToInclude: Property.string(""),
        _myFunctionPathsToExclude: Property.string(""),
        _myExcludeConstructors: Property.bool(false),
        _myClearConsoleBeforeLog: Property.bool(false),
        _myResetMaxResultsShortcutEnabled: Property.bool(false)
    };

    init() {
        this.object.pp_addComponent(DebugFunctionsPerformanceAnalyzerComponent, {
            _myObjectsByPath: "WL",
            _myDelayStart: this._myDelayStart,
            _myLogTitle: "WL Functions Performance Analysis Results",
            _myLogFunction: this._myLogFunction,
            _mySecondsBetweenLogs: this._mySecondsBetweenLogs,
            _myLogMaxResults: this._myLogMaxResults,
            _myLogSortOrder: this._myLogSortOrder,
            _myLogMaxAmountOfFunctions: this._myLogMaxAmountOfFunctions,
            _myLogFunctionsWithCallsCountAbove: this._myLogFunctionsWithCallsCountAbove,
            _myLogFunctionsWithTotalExecutionTimePercentageAbove: this._myLogFunctionsWithTotalExecutionTimePercentageAbove,
            _myLogCallsCountResults: this._myLogCallsCountResults,
            _myLogTotalExecutionTimeResults: this._myLogTotalExecutionTimeResults,
            _myLogTotalExecutionTimePercentageResults: this._myLogTotalExecutionTimePercentageResults,
            _myLogAverageExecutionTimeResults: this._myLogAverageExecutionTimeResults,
            _myFunctionPathsToInclude: this._myFunctionPathsToInclude,
            _myFunctionPathsToExclude: this._myFunctionPathsToExclude,
            _myExcludeConstructors: this._myExcludeConstructors,
            _myExcludeJSObjectFunctions: true,
            _myAddPathPrefixToFunctionID: true,
            _myObjectAddObjectDescendantsDepthLevel: 1,
            _myObjectAddClassDescendantsDepthLevel: 1,
            _myClearConsoleBeforeLog: this._myClearConsoleBeforeLog,
            _myResetMaxResultsShortcutEnabled: this._myResetMaxResultsShortcutEnabled
        });
    }
}