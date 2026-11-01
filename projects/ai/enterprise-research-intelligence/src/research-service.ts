import {randomUUID} from "node:crypto";
import {searchDocuments} from "./retrieval";
import {searchWeb} from "./search-provider";
import type {ResearchReport,Source} from "./types";
const reports=new Map<string,ResearchReport>();
export function resetReports(){reports.clear();}
export function getReport(id:string){return reports.get(id);}
export function listReports(){return [...reports.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
function unique(sources:Source[]){const seen=new Set<string>();return sources.filter(s=>{if(seen.has(s.url))return false;seen.add(s.url);return true;});}
function makeReport(query:string,sources:Source[],themes:string[],mode:string){
 const evidence=sources.length?sources.map((s,i)=>"- [S"+(i+1)+"] **"+s.title+"**: "+s.content.slice(0,420).trim()).join("\n"):"No source material was available. Configure TAVILY_API_KEY for live search or upload relevant documents before drawing conclusions.";
 const refs=sources.map((s,i)=>"["+(i+1)+"] "+s.title+"\n    URL: "+s.url+(s.publishedDate?"\n    Published: "+s.publishedDate:"")+"\n    Type: "+s.sourceType+"; retrieval relevance: "+s.relevanceScore).join("\n\n");
 const gaps=sources.length?["Snippets and uploaded passages have not been independently fact-checked.","Relevance scores are retrieval signals, not publisher credibility ratings.","Verify publication dates and original evidence before making decisions."]:["No sources were retrieved.","No market, competitor or trend conclusions can responsibly be drawn from this run."];
 return ["# Research and Intelligence Report","", "**Research question:** "+query,"**Generated:** "+new Date().toISOString(),"**Research mode:** "+mode,"**Evidence sources:** "+sources.length,"","## Executive summary",sources.length?"This report organises retrieved material for review. Observations are excerpts and retrieval-led themes, not independently verified conclusions.":"Insufficient evidence: no live search results or uploaded document passages were available.","","## Research themes",themes.length?themes.map(t=>"- "+t).join("\n"):"- No themes could be extracted.","","## Evidence and observations",evidence,"","## Evidence gaps and cautions",gaps.map(g=>"- "+g).join("\n"),"","## Sources",refs||"No sources.","","## Recommended next steps","- Open and review original sources.","- Confirm important claims against primary evidence and current filings.","- Record analyst assumptions separately from sourced facts."].join("\n");
}
export async function runResearch(query:string):Promise<ResearchReport>{
 const web=await searchWeb(query);const local=searchDocuments(query);const sources=unique([...web.sources,...local]).slice(0,12);
 const mode:ResearchReport["researchMode"]=web.mode==="tavily-live"?"tavily-live":local.length?"uploaded-documents-only":"no-source-connector";
 const terms=[...new Set(query.toLowerCase().match(/[a-z0-9]{4,}/g)||[])];
 const corpus=sources.map(s=>s.content.toLowerCase()).join(" ");const themes=terms.filter(t=>corpus.includes(t)).slice(0,10);
 const findings=sources.map((s,i)=>"- [S"+(i+1)+"] **"+s.title+"**: "+s.content.slice(0,420).trim());
 const gaps=sources.length?["Snippets and uploaded passages require independent verification.","Relevance scores do not measure source credibility."]:["No source material was retrieved; do not treat this report as market evidence."];
 const report:ResearchReport={id:randomUUID(),query,createdAt:new Date().toISOString(),status:sources.length?"completed":"insufficient_evidence",researchMode:mode,sources,themes,findings,gaps,reportMarkdown:makeReport(query,sources,themes,mode)};
 reports.set(report.id,report);return report;
}
