import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { SERVER_URL } from '../constants';

export type HTTPVerb = 'GET' | 'POST' | 'PUT' | 'DELETE';

axios.defaults.withCredentials = true;
axios.interceptors.request.use((config: AxiosRequestConfig) => {
    // Request csrf cookie if not exists.
    if (!csrfCookieExists() && config.method !== 'get') {
        return axios.get(SERVER_URL + '/sanctum/csrf-cookie').then(rsp => config);
    }
    return config;
});

const apiClient = {
    get,
    post,
    put,
    delete: _delete,
};

export default apiClient;

export function request(
    method: HTTPVerb,
    endpoint: string,
    data: object = {},
    axiosConfig: AxiosRequestConfig = {},
) {
    const config: AxiosRequestConfig = {
        method: method,
        url: endpoint,
        baseURL: SERVER_URL,
        headers: {
            Accept: 'application/json',
        },
        data: {},
        params: {},
        withCredentials: true,
        ...axiosConfig,
    };

    switch (config.method) {
        case 'POST':
        case 'PUT':
            config.data = data;
            break;
        case 'GET':
        default:
            config.params = data;
    }

    return axios.request(config);
}

export function get(endpoint: string, params: object = {}) {
    return request('GET', endpoint, params);
}

export function post(endpoint: string, data: object, config: AxiosRequestConfig = {}) {
    return request('POST', endpoint, data, config);
}

export function put(endpoint: string, data: object) {
    return request('PUT', endpoint, data);
}

// prefixed with underscored because delete is a reserved word in javascript
export function _delete(endpoint: string, params: object = {}) {
    return request('DELETE', endpoint, params);
}

//utility
export function csrfCookieExists() {
    if (document.cookie.split(';').some((item) => item.trim().startsWith('XSRF-TOKEN='))) {
        return true;
    }
    return false;
}

export function clearSession() {
    localStorage.removeItem('userInfo');
    document.cookie = 'XSRF-TOKEN=; Max-Age=0; path=/; domain='
        + window.location.hostname;
}


