/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { createClient, CreateClientParams } from 'contentful';

import { revalidate } from '~/client/revalidate-target';

const adapter: CreateClientParams['adapter'] = async (config) => {
  const { url, method, headers = {}, data, params } = config;

  if (!url || !method) {
    throw new Error('Error on fetching data');
  }

  const urlObject = new URL(url);

  if (params) urlObject.search = new URLSearchParams(params).toString();

  const fetchConfig: RequestInit = {
    method: method.toUpperCase(),
    headers: new Headers(headers),
    body: ['GET', 'HEAD'].includes(method.toUpperCase()) ? null : JSON.stringify(data),
    next: { revalidate },
  };

  const response = await fetch(urlObject.toString(), fetchConfig);

  let responseData;
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  return {
    data: responseData,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    config,
    request: fetchConfig,
  };
};

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ?? '',
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? '',
  adapter,
});
