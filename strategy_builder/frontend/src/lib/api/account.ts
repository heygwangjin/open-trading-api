/**
 * Account API
 */

import { apiGet, type ApiResponse } from "./client";
import type { AccountInfo, Holding, Balance, UsBalance, BuyableInfo } from "@/types/account";

export async function getAccountInfo(): Promise<ApiResponse<AccountInfo>> {
  return apiGet<ApiResponse<AccountInfo>>("/api/account/info");
}

export async function getHoldings(
  market: "domestic" | "us" = "domestic"
): Promise<ApiResponse<Holding[]>> {
  return apiGet<ApiResponse<Holding[]>>(`/api/account/holdings?market=${market}`);
}

export async function getBalance(
  market: "domestic" | "us" = "domestic"
): Promise<ApiResponse<Balance | UsBalance>> {
  return apiGet<ApiResponse<Balance | UsBalance>>(`/api/account/balance?market=${market}`);
}

export async function getBuyableAmount(
  stockCode: string,
  price: number = 0,
  market: "domestic" | "us" = "domestic"
): Promise<ApiResponse<BuyableInfo>> {
  const params = new URLSearchParams({ market });
  if (price > 0) params.set("price", String(price));
  return apiGet<ApiResponse<BuyableInfo>>(`/api/account/buyable/${stockCode}?${params}`);
}
