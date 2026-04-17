/**
 * Account Types
 */

export interface AccountInfo {
  account_no: string;        // 계좌번호 (마스킹)
  account_no_full: string;   // 계좌번호 전체 (계좌번호-상품코드)
  account_type: string;      // 계좌유형 (위탁/선물옵션/개인연금 등)
  prod_code: string;         // 계좌상품코드 (01, 03, 22 등)
  is_vps: boolean;           // 모의투자 여부
  mode: string;              // 투자 모드 ("모의투자" | "실전투자")
}

export interface Holding {
  stock_code: string;        // 종목코드
  stock_name: string;        // 종목명
  quantity: number;          // 보유수량
  avg_price: number;         // 매입평균단가
  current_price: number;     // 현재가
  eval_amount: number;       // 평가금액
  profit_loss: number;       // 평가손익
  profit_rate: number;       // 수익률 (%)
}

/** 국내주식 계좌 요약 */
export interface Balance {
  deposit: number;                    // 예수금총금액
  total_eval: number;                 // 총평가금액
  purchase_amount: number;            // 매입금액합계
  eval_amount: number;                // 평가금액합계
  profit_loss: number;                // 평가손익합계
  deposit_formatted?: string;         // 예수금 포맷 ("X,XXX원")
  total_eval_formatted?: string;      // 총평가금액 포맷
  profit_loss_formatted?: string;     // 평가손익 포맷 ("+X,XXX원")
}

/** 미국주식 계좌 요약 (USD 기준) */
export interface UsBalance {
  purchase_amount: number;            // 외화매수금액합계 (USD)
  profit_loss: number;                // 해외총손익 (USD)
  eval_profit_loss: number;           // 총평가손익금액 (USD)
  profit_rate: number;                // 총수익률 (%)
  realized_profit_loss: number;       // 해외실현손익금액 (USD)
  realized_return_rate: number;       // 실현수익율 (%)
  purchase_amount_formatted?: string; // 외화매수금액 포맷 ("$X,XXX.XX")
  profit_loss_formatted?: string;     // 총손익 포맷 ("+$X,XXX.XX")
  profit_rate_formatted?: string;     // 수익률 포맷 ("+X.XX%")
}

export interface BuyableInfo {
  stock_code: string;        // 종목코드
  price: number;             // 조회 기준 단가
  amount: number;            // 매수가능금액 (국내: 원화, 미국: USD)
  quantity: number;          // 매수가능수량
  amount_formatted?: string; // 매수가능금액 포맷
}
