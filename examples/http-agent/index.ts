import logger, { DaLogger } from '@hvu/dalogger';
import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';

let agentId = 0;

function axiosAgent(args: AxiosRequestConfig): AxiosInstance {
  const headers = args.headers || {};

  const agentLogger = logger().createChild((++agentId).toString(), { agentId });
  headers['dalogger-trace-key'] = agentLogger.traceKey();

  const agent = axios.create({
    ...args,
    headers,
  });

  agent.interceptors.request.use((config: AxiosRequestConfig) => {
    agentLogger.debug(
      `[REQUEST] ${config.method?.toUpperCase()} ${config.baseURL ? config.baseURL + config.url : config.url}`,
      {
        headers: { ...config.headers },
      },
    );
    return config;
  });

  agent.interceptors.response.use((response: AxiosResponse) => {
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

async function main() {
  // optional, make trace key easier to read for this demo:
  DaLogger.register('http-request-demo');

  const agent1 = axiosAgent({ baseURL: 'https://example.com' });
  const agent2 = axiosAgent({ baseURL: 'https://example.com' });

  const [response1, response2] = await Promise.all([agent1.get('/'), agent2.get('/')]);
  logger().debug('Response 1', response1.data);
  logger().debug('Response 2', response2.data);
}

main();
