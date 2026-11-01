let activeReport=null;
const form=document.querySelector("#research-form"),query=document.querySelector("#query"),run=document.querySelector("#run");
function renderReport(report){
 activeReport=report;document.querySelector("#report").classList.remove("hidden");
 document.querySelector("#report-title").textContent=report.query;
 document.querySelector("#report-status").textContent=report.status.replaceAll("_"," ").toUpperCase();
 document.querySelector("#source-count").textContent=report.sources.length;
 document.querySelector("#theme-count").textContent=report.themes.length;
 document.querySelector("#mode").textContent=report.researchMode.replaceAll("-"," ");
 const findings=document.querySelector("#findings");findings.replaceChildren();
 (report.findings.length?report.findings:["No findings: no evidence sources were retrieved."]).forEach(line=>{const div=document.createElement("div");div.className="finding";div.textContent=line;findings.append(div);});
 const gaps=document.querySelector("#gaps");gaps.replaceChildren();report.gaps.forEach(gap=>{const li=document.createElement("li");li.textContent=gap;gaps.append(li);});
 const sourceList=document.querySelector("#source-list");sourceList.replaceChildren();
 report.sources.forEach((source,index)=>{const row=document.createElement("div");row.className="source-row";const link=document.createElement("a");link.href=source.url.startsWith("http")?source.url:"#";link.target="_blank";link.rel="noopener noreferrer";link.textContent="[S"+(index+1)+"] "+source.title;const details=document.createElement("p");details.textContent=source.content.slice(0,360);const meta=document.createElement("small");meta.textContent=source.sourceType+" · retrieval relevance "+source.relevanceScore;row.append(link,details,meta);sourceList.append(row);});
 document.querySelector("#markdown").textContent=report.reportMarkdown;refreshHistory();
}
async function refreshHistory(){
 const container=document.querySelector("#history-list");
 try{const response=await fetch("/api/reports");const reports=await response.json();container.replaceChildren();if(!reports.length){const p=document.createElement("p");p.className="hint";p.textContent="Reports will appear here.";container.append(p);return;}
 reports.slice(0,8).forEach(report=>{const row=document.createElement("div");row.className="history-row";const title=document.createElement("span");title.textContent=report.query;const status=document.createElement("span");status.textContent=report.sourceCount+" sources · "+report.status;row.append(title,status);container.append(row);});
 }catch{container.textContent="Unable to load report history.";}
}
form.addEventListener("submit",async event=>{event.preventDefault();run.disabled=true;run.textContent="Researching…";try{const response=await fetch("/api/research",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:query.value.trim()})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Research request failed.");renderReport(data);}catch(error){window.alert(error instanceof Error?error.message:"Unable to run research.");}finally{run.disabled=false;run.textContent="Start research →";}});
document.querySelector("#upload-form").addEventListener("submit",async event=>{event.preventDefault();const file=document.querySelector("#file").files[0];if(!file)return;const data=new FormData();data.append("file",file);const status=document.querySelector("#upload-status");status.textContent="Uploading and extracting text…";try{const response=await fetch("/api/documents",{method:"POST",body:data});const result=await response.json();if(!response.ok)throw new Error(result.error||"Upload failed.");status.textContent="Indexed "+result.filename+": "+result.chunks+" chunks ready for retrieval.";event.currentTarget.reset();}catch(error){status.textContent=error instanceof Error?error.message:"Upload failed."; }});
document.querySelector("#export").addEventListener("click",()=>{if(activeReport)window.location.href="/api/reports/"+activeReport.id+"/export";});
document.querySelector("#refresh").addEventListener("click",refreshHistory);refreshHistory();
