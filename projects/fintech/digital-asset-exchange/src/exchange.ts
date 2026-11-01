import { randomUUID } from "node:crypto";

export type Side = "buy" | "sell";
export type OrderType = "limit" | "market";
export type OrderStatus = "open" | "partially_filled" | "filled" | "cancelled" | "rejected";
export interface Order {
 id:string; accountId:string; symbol:string; side:Side; type:OrderType;
 price:number|null; quantity:number; remaining:number; filled:number;
 status:OrderStatus; createdAt:number; sequence:number;
}
export interface Trade {
 id:string; symbol:string; price:number; quantity:number;
 buyerOrderId:string; sellerOrderId:string; buyerAccountId:string; sellerAccountId:string; timestamp:number;
}
type Wallet={base:number;quote:number};
type Market={baseAsset:string;quoteAsset:string;tickSize:number;lotSize:number;maxOrderNotional:number};
const key=(account:string,symbol:string)=>account+":"+symbol;
export class Exchange {
 private markets=new Map<string,Market>();
 private wallets=new Map<string,Wallet>();
 private orders=new Map<string,Order>();
 private trades:Trade[]=[];
 private sequence=0;
 constructor(){
  this.markets.set("NSTAR-USD",{baseAsset:"NSTAR",quoteAsset:"USD",tickSize:0.01,lotSize:0.0001,maxOrderNotional:1_000_000});
 }
 addMarket(symbol:string,market:Market){if(this.markets.has(symbol))throw new Error("Market already exists");this.markets.set(symbol,market);}
 fund(accountId:string,base:number,quote:number){
  if(!accountId||base<0||quote<0||!Number.isFinite(base+quote))throw new Error("Invalid funding");
  const w=this.wallets.get(accountId)??{base:0,quote:0};w.base+=base;w.quote+=quote;this.wallets.set(accountId,w);
 }
 balance(accountId:string){return {...(this.wallets.get(accountId)??{base:0,quote:0})};}
 listOrders(accountId?:string){return [...this.orders.values()].filter(o=>!accountId||o.accountId===accountId).map(o=>({...o}));}
 listTrades(symbol?:string){return this.trades.filter(t=>!symbol||t.symbol===symbol).map(t=>({...t}));}
 getOrder(id:string){const o=this.orders.get(id);return o?{...o}:undefined;}
 book(symbol:string){
  if(!this.markets.has(symbol))throw new Error("Unknown market");
  const active=[...this.orders.values()].filter(o=>o.symbol===symbol&&(o.status==="open"||o.status==="partially_filled"));
  const aggregate=(side:Side)=>{const levels=new Map<number,number>();for(const o of active.filter(x=>x.side===side&&x.type==="limit"))levels.set(o.price!, (levels.get(o.price!)??0)+o.remaining);
   return [...levels.entries()].map(([price,quantity])=>({price,quantity})).sort((a,b)=>side==="buy"?b.price-a.price:a.price-b.price).slice(0,20);};
  return {symbol,bids:aggregate("buy"),asks:aggregate("sell"),lastPrice:this.trades.filter(t=>t.symbol===symbol).at(-1)?.price??null};
 }
 submit(input:{accountId:string;symbol:string;side:Side;type:OrderType;quantity:number;price?:number}):Order{
  const market=this.markets.get(input.symbol);if(!market)throw new Error("Unknown market");
  if(!input.accountId||!Number.isFinite(input.quantity)||input.quantity<=0)throw new Error("Invalid order quantity");
  if(input.type==="limit"&&(!Number.isFinite(input.price)||!input.price||input.price<=0))throw new Error("Limit order requires positive price");
  if(input.type==="market"&&input.price!==undefined)throw new Error("Market order must not specify price");
  if(!this.multiple(input.quantity,market.lotSize))throw new Error("Quantity violates lot size");
  if(input.type==="limit"&&!this.multiple(input.price!,market.tickSize))throw new Error("Price violates tick size");
  if(input.type==="limit"&&input.quantity*input.price!>market.maxOrderNotional)throw new Error("Order exceeds notional limit");
  const wallet=this.wallets.get(input.accountId)??{base:0,quote:0};
  if(input.side==="buy"){
   const reservePrice=input.type==="limit"?input.price!:this.bestAsk(input.symbol)?.price;
   if(reservePrice==null)throw new Error("No liquidity for market order");
   const required=input.quantity*reservePrice;
   if(wallet.quote<required)throw new Error("Insufficient quote balance");
  }else if(wallet.base<input.quantity)throw new Error("Insufficient base balance");
  const order:Order={id:randomUUID(),accountId:input.accountId,symbol:input.symbol,side:input.side,type:input.type,price:input.price??null,quantity:input.quantity,remaining:input.quantity,filled:0,status:"open",createdAt:Date.now(),sequence:++this.sequence};
  this.orders.set(order.id,order);
  this.match(order);
  if(order.type==="market"&&order.remaining>0){order.status=order.filled>0?"partially_filled":"rejected";}
  return {...order};
 }
 cancel(orderId:string,accountId:string){
  const o=this.orders.get(orderId);if(!o)throw new Error("Order not found");
  if(o.accountId!==accountId)throw new Error("Not order owner");
  if(o.status!=="open"&&o.status!=="partially_filled")throw new Error("Order is not active");
  o.status="cancelled";return {...o};
 }
 private multiple(value:number,step:number){return Math.abs(value/step-Math.round(value/step))<1e-7;}
 private bestAsk(symbol:string){return [...this.orders.values()].filter(o=>o.symbol===symbol&&o.side==="sell"&&o.type==="limit"&&(o.status==="open"||o.status==="partially_filled")).sort((a,b)=>a.price!-b.price!||a.sequence-b.sequence)[0];}
 private match(incoming:Order){
  const opposite:Side=incoming.side==="buy"?"sell":"buy";
  const candidates=[...this.orders.values()].filter(o=>o.id!==incoming.id&&o.symbol===incoming.symbol&&o.side===opposite&&o.type==="limit"&&(o.status==="open"||o.status==="partially_filled"));
  candidates.sort((a,b)=>incoming.side==="buy"?(a.price!-b.price!)||a.sequence-b.sequence:(b.price!-a.price!)||a.sequence-b.sequence);
  for(const resting of candidates){
   if(incoming.remaining<=0)break;
   if(incoming.type==="limit"&&(incoming.side==="buy"?incoming.price!<resting.price!:incoming.price!>resting.price!))break;
   const qty=Math.min(incoming.remaining,resting.remaining),price=resting.price!;
   const buyer=incoming.side==="buy"?incoming:resting,seller=incoming.side==="sell"?incoming:resting;
   const buyerWallet=this.wallets.get(buyer.accountId)??{base:0,quote:0};
   const sellerWallet=this.wallets.get(seller.accountId)??{base:0,quote:0};
   const cost=qty*price;
   if(sellerWallet.base<qty||buyerWallet.quote<cost)continue;
   buyerWallet.quote-=cost;buyerWallet.base+=qty;sellerWallet.base-=qty;sellerWallet.quote+=cost;
   this.wallets.set(buyer.accountId,buyerWallet);this.wallets.set(seller.accountId,sellerWallet);
   incoming.remaining-=qty;incoming.filled+=qty;resting.remaining-=qty;resting.filled+=qty;
   incoming.status=incoming.remaining===0?"filled":"partially_filled";
   resting.status=resting.remaining===0?"filled":"partially_filled";
   this.trades.push({id:randomUUID(),symbol:incoming.symbol,price,quantity:qty,buyerOrderId:buyer.id,sellerOrderId:seller.id,buyerAccountId:buyer.accountId,sellerAccountId:seller.accountId,timestamp:Date.now()});
  }
 }
}
