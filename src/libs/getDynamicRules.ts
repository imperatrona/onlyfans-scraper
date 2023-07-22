import axios from "axios";

export interface Rules {
  static_param: string;
  start: string;
  end: string;
  checksum_constant: number;
  checksum_indexes: number[];
  app_token: string;
  remove_headers: string[];
  revision: string;
  is_current: any;
  format: string;
  prefix: string;
  suffix: string;
}

export async function getDynamicRules(): Promise<Rules> {
  const req = await axios.get(
    "https://raw.githubusercontent.com/deviint/onlyfans-dynamic-rules/main/dynamicRules.json"
  );

  if (req.status !== 200)
    throw new Error(
      `can't recieve dynamic rules.\nStatus: ${req.status}\nBody: ${req.data}`
    );

  return req.data as Rules;
}
