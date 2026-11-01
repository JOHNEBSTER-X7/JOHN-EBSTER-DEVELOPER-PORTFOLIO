import type { Source } from "./types";
type Result={title?:string;url?:string;content?:string;score?:number;published_date?:string};
export async function searchWeb(query:string):Promise<{mode:"tavily-live"|"no-source-connector";sources:Source[]}>{
 const key=process.env.TAVILY_API_KEY;if(!key)return {mode:"no-source-connector",sources:[]};
 try{
 const response=await fetch("https://api.tavily.com/search",{method:"POST",headers:{"Content-Type":"application/json"},signal:AbortSignal.timeout(12000),body:JSON.stringify({api_key:key,query,search_depth:"basic",max_results:8,include_answer:false})});
 if(!response.ok)return {mode:"no-source-connector",sources:[]};
 const payload=await response.json() as {results?:Result[]};
 const sources=(payload.results||[]).filter(x=>x.url&&x.content).map(x=>({id:"web-"+Buffer.from(x.url!).toString("base64url").slice(0,18),title:x.title||x.url!,url:x.url!,content:x.content!,publishedDate:x.published_date,sourceType:"web" as const,relevanceScore:Number(Math.max(0,Math.min(1,x.score||0)).toFixed(3))}));
 return {mode:"tavily-live",sources};
 }catch{return {mode:"no-source-connector",sources:[]};}
}
