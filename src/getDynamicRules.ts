import axios from "axios";

export async function getDynamicRules(): Promise<Rules> {
  const req = await axios.get(
    "https://raw.githubusercontent.com/DATAHOARDERS/dynamic-rules/refs/heads/main/onlyfans.json"
  );

  if (req.status !== 200)
    throw new Error(
      `can't recieve dynamic rules.\nStatus: ${req.status}\nBody: ${req.data}`
    );

  return req.data as Rules;
}

export interface Rules {
  static_param: string;
  format: string;
  checksum_indexes: number[];
  checksum_constants: number[];
  checksum_constant: number;
  app_token: string;
  remove_headers: string[];
  error_code: number;
  message: string;
}
