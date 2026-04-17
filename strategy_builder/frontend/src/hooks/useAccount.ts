"use client";

import { useState, useCallback, useRef } from "react";
import { getAccountInfo, getHoldings, getBalance } from "@/lib/api";
import type { AccountInfo, Holding, Balance, UsBalance } from "@/types/account";

// Minimum interval between API calls (in milliseconds)
const MIN_FETCH_INTERVAL = 5000; // 5 seconds

interface UseAccountResult {
  info: AccountInfo | null;
  holdings: Holding[];
  balance: Balance | null;
  usBalance: UsBalance | null;
  isLoading: boolean;
  error: string | null;
  fetchInfo: () => Promise<void>;
  fetchHoldings: (market?: "domestic" | "us") => Promise<void>;
  fetchBalance: (market?: "domestic" | "us") => Promise<void>;
  refresh: (market?: "domestic" | "us") => Promise<void>;
  resetThrottle: () => void;
}

export function useAccount(): UseAccountResult {
  const [info, setInfo] = useState<AccountInfo | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [usBalance, setUsBalance] = useState<UsBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track last fetch times to prevent excessive API calls
  const lastFetchTimes = useRef({
    info: 0,
    holdings: 0,
    balance: 0,
  });

  const fetchInfo = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTimes.current.info < MIN_FETCH_INTERVAL) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await getAccountInfo();
      if (response.status === "success" && response.data) {
        setInfo(response.data);
        setError(null);
        lastFetchTimes.current.info = now;
      } else {
        setError(response.message || "계좌 정보 조회 실패");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "계좌 정보 조회 오류";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHoldings = useCallback(async (market: "domestic" | "us" = "domestic") => {
    const now = Date.now();
    if (now - lastFetchTimes.current.holdings < MIN_FETCH_INTERVAL) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await getHoldings(market);
      if (response.status === "success") {
        setHoldings(response.data || []);
        setError(null);
        lastFetchTimes.current.holdings = now;
      } else {
        setError(response.message || "보유 종목 조회 실패");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "보유 종목 조회 오류";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBalance = useCallback(async (market: "domestic" | "us" = "domestic") => {
    const now = Date.now();
    if (now - lastFetchTimes.current.balance < MIN_FETCH_INTERVAL) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await getBalance(market);
      if (response.status === "success" && response.data) {
        if (market === "us") {
          setUsBalance(response.data as UsBalance);
          setBalance(null);
        } else {
          setBalance(response.data as Balance);
          setUsBalance(null);
        }
        setError(null);
        lastFetchTimes.current.balance = now;
      } else {
        setError(response.message || "예수금 조회 실패");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "예수금 조회 오류";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetThrottle = useCallback(() => {
    lastFetchTimes.current = { info: 0, holdings: 0, balance: 0 };
  }, []);

  const refresh = useCallback(async (market: "domestic" | "us" = "domestic") => {
    resetThrottle();

    setIsLoading(true);
    setError(null);

    try {
      await fetchInfo();
      await fetchHoldings(market);
      await fetchBalance(market);
    } catch (err) {
      const message = err instanceof Error ? err.message : "조회 오류";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [resetThrottle, fetchInfo, fetchHoldings, fetchBalance]);

  return {
    info,
    holdings,
    balance,
    usBalance,
    isLoading,
    error,
    fetchInfo,
    fetchHoldings,
    fetchBalance,
    refresh,
    resetThrottle,
  };
}

export default useAccount;
