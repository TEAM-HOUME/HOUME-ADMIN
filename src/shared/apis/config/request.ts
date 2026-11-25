import type { BaseResponse } from '@shared/types/apis';

import axiosInstance from './axiosInstance';
import { nullToUndefined } from './nullToUndefined';

import type { AxiosResponse } from 'axios';

export const HTTPMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

export type HTTPMethodType = (typeof HTTPMethod)[keyof typeof HTTPMethod];
type QueryValue = string | number | boolean | Array<string | number | boolean>;

export interface RequestConfig {
  method: HTTPMethodType;
  url: string;
  query?: Record<string, QueryValue | undefined>;
  body?: object;
  rawResponse?: boolean;
}

const toSearchParams = (query: RequestConfig['query']) => {
  if (!query) return undefined;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, String(item)));
    } else {
      params.append(key, String(value));
    }
  });
  return params;
};

// 오버로드: rawResponse: true → AxiosResponse 전체 반환
export async function request<T>(
  config: RequestConfig & { rawResponse: true }
): Promise<AxiosResponse<BaseResponse<T>>>;
// 오버로드: 기본 → data만 반환
export async function request<T>(config: RequestConfig): Promise<T>;
// 구현
export async function request<T>(
  config: RequestConfig
): Promise<T | AxiosResponse<BaseResponse<T>>> {
  const { method, url, query, body, rawResponse } = config;

  const response = await axiosInstance.request<BaseResponse<T>>({
    method,
    url,
    params: toSearchParams(query),
    data: body,
  });

  if (rawResponse) return response;
  // 서버의 null을 생성 타입(optional = undefined)에 맞춘다 (nullToUndefined 주석 참고)
  return nullToUndefined(response.data.data);
}
