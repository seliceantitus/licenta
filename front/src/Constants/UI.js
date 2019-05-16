import React from "react";

export const TOAST_INFO = "info";
export const TOAST_SUCCESS = "success";
export const TOAST_WARN = "warning";
export const TOAST_ERROR = "error";

export const STATUS_ERROR = (pulse) => pulse ? <status-indicator negative pulse/> : <status-indicator negative/>;
export const STATUS_WARNING = (pulse) => pulse ? <status-indicator intermediary pulse/> : <status-indicator intermediary/>;
export const STATUS_OK = (pulse) => pulse ? <status-indicator positive pulse/> : <status-indicator positive/>;
export const STATUS_DEFAULT = (pulse) => pulse ? <status-indicator active pulse/> : <status-indicator active/>;
export const STATUS_UNKNOWN = (pulse) => pulse ? <status-indicator pulse/> : <status-indicator/>;

export const DEFAULT_XS_COL_WIDTH = 10;
export const DEFAULT_MD_COL_WIDTH = 10;
