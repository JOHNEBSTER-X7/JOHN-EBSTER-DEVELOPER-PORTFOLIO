import type {Contact} from "./types";
export type WorkflowKind="sales_follow_up"|"support_response"|"research_brief";
export function recommend(kind:WorkflowKind,input:string,contact?:Contact){
 const clean=input.trim();
 if(kind==="sales_follow_up")return {title:"Sales follow-up: "+(contact?.company||"prospect"),description:"Review this draft recommendation before contacting the prospect. Context: "+clean,assignedTo:"Sales team",priority:"medium" as const,recommendation:"Suggested next step: acknowledge the prospect's stated need, confirm decision criteria and propose a short discovery conversation. This is a draft recommendation; no message has been sent."};
 if(kind==="support_response")return {title:"Support response review",description:"Human review required before sending any customer response. Context: "+clean,assignedTo:"Customer support",priority:"high" as const,recommendation:"Suggested response approach: acknowledge the issue, summarise the facts supplied, ask for missing diagnostic details and state a realistic next update. This draft has not been sent and does not assert a resolution."};
 return {title:"Research brief review",description:"Validate sources and assumptions before sharing. Research question: "+clean,assignedTo:"Business analyst",priority:"medium" as const,recommendation:"Research plan: define the decision question, identify primary sources, compare alternatives, record assumptions and evidence gaps, then prepare a cited summary. No external research has been performed by this deterministic template."};
}
