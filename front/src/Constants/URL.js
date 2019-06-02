export const SOCKET_URL = `http://localhost:3002`;

export const API = {
    SCAN_INDEX: {
        URL: `http://localhost:3001/scan`,
        METHOD: 'GET'
    },
    SCAN_VIEW: {
        URL: (scan_id) => `http://localhost:3001/scan/${scan_id}`,
        METHOD: 'GET'
    },
    SCAN_NEW: {
        URL: `http://localhost:3001/scan`,
        METHOD: 'POST'
    },
    SCAN_DELETE: {
        URL: (scan_id) => `http://localhost:3001/scan/${scan_id}`,
        METHOD: 'DELETE',
    },
    LAYER_INDEX: {
        URL: `http://localhost:3001/layer`,
        METHOD: 'GET'
    },
    LAYER_NEW: {
        URL: `http://localhost:3001/layer`,
        METHOD: 'POST'
    },
    LAYER_DELETE: {
        URL: (layer_id) => `http://localhost:3001/scan/${layer_id}`,
        METHOD: 'DELETE'
    }
};