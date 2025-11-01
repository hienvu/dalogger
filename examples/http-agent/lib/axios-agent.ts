import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import logger from '@hvu/dalogger';

let agentId = 0;

export function axiosAgent(args: AxiosRequestConfig): AxiosInstance {
  const headers = args.headers || {};
  const agentLogger = logger().createChild((++agentId).toString());
  headers['dalogger-trace-key'] = agentLogger.traceKey();

  const agent = axios.create({
    ...args,
    headers,
  });

  agent.interceptors.request.use((config) => {
    agentLogger.debug(
      `[REQUEST] ${config.method?.toUpperCase()} ${config.baseURL ? config.baseURL + config.url : config.url}`,
      {
        headers: { ...config.headers },
      },
    );
    return config;
  });

  agent.interceptors.response.use((response) => {
    agentLogger.debug(
      `[RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.baseURL ? response.config.baseURL + response.config.url : response.config.url}`,
      {
        method: response.config.method?.toUpperCase(),
        url: response.config.baseURL ? `${response.config.baseURL}${response.config.url}` : response.config.url,
        headers: response.headers,
      },
    );
    return response;
  });

  return agent;
}
