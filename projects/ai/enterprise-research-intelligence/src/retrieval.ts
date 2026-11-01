import { randomUUID } from "node:crypto";
import type { Source } from "./types";
type Chunk = { documentId:string; filename:string; chunkIndex:number; text:string };
const documents:Array<{id:string;filename:string;chunks:Chunk[];createdAt:string}> = [];
export function resetDocuments(){documents.splice(0,documents.length);}
export function listDocuments(){return documents.map(({id,filename,chunks,createdAt})=>({id,filename,chunks:chunks.length,createdAt}));}
export function chunkText(input:string,size=850,overlap=100):string[]{
 const text=input.replace(/\s+/g," ").trim(); if(!text)return [];
 if(size<1||overlap<0||overlap>=size)throw new Error("Invalid chunk parameters.");
 const chunks:string[]=[]; let start=0;
 while(start<text.length){let end=Math.min(start+size,text.length);if(end<text.length){const boundary=text.lastIndexOf(" ",end);if(boundary>start+size*.55)end=boundary;}
 const part=text.slice(start,end).trim();if(part)chunks.push(part);if(end>=text.length)break;start=Math.max(end-overlap,start+1);}
 return chunks;
}
export function addDocument(filename:string,text:string){
 const chunks=chunkText(text).map((chunk,chunkIndex)=>({documentId:"",filename,chunkIndex,text:chunk}));
 if(!chunks.length)throw new Error("No extractable text found in this document.");
 const id=randomUUID();chunks.forEach(chunk=>chunk.documentId=id);documents.push({id,filename,chunks,createdAt:new Date().toISOString()});
 return {id,filename,chunks:chunks.length};
}
function tokens(value:string){return new Set((value.toLowerCase().match(/[a-z0-9]{2,}/g)||[]).filter(w=>!["the","and","for","with","from","this","that","what","when","where","how"].includes(w)));}
export function searchDocuments(query:string,limit=6):Source[]{
 const terms=tokens(query);if(!terms.size)return [];
 const ranked:Array<{score:number;chunk:Chunk}>=[];
 for(const doc of documents)for(const chunk of doc.chunks){const words=tokens(chunk.text);const hits=[...terms].filter(t=>words.has(t)).length;if(hits)ranked.push({score:hits/Math.sqrt(terms.size),chunk});}
 return ranked.sort((a,b)=>b.score-a.score).slice(0,limit).map(({score,chunk})=>({id:"doc-"+chunk.documentId+"-"+chunk.chunkIndex,title:chunk.filename+" — section "+(chunk.chunkIndex+1),url:"document://"+chunk.documentId+"#chunk-"+chunk.chunkIndex,content:chunk.text,sourceType:"document",relevanceScore:Number(score.toFixed(3))}));
}
