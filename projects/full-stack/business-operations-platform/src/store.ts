import {randomUUID} from "node:crypto";
import type {Activity,Contact,ContactStatus,Task,TaskStatus,Workflow} from "./types";
const contacts=new Map<string,Contact>(),tasks=new Map<string,Task>(),workflows=new Map<string,Workflow>(),activities:Activity[]=[];
export function resetStore(){contacts.clear();tasks.clear();workflows.clear();activities.splice(0);}
function activity(type:string,message:string){activities.unshift({id:randomUUID(),type,message,createdAt:new Date().toISOString()});}
export function listContacts(){return [...contacts.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export function getContact(id:string){return contacts.get(id);}
export function createContact(data:{name:string;email:string;company:string;status?:ContactStatus}){
 if([...contacts.values()].some(c=>c.email.toLowerCase()===data.email.toLowerCase()))throw new Error("EMAIL_EXISTS");
 const contact:Contact={id:randomUUID(),name:data.name,email:data.email.toLowerCase(),company:data.company,status:data.status||"lead",createdAt:new Date().toISOString()};
 contacts.set(contact.id,contact);activity("contact.created","Created contact "+contact.name);return contact;
}
export function updateContact(id:string,data:{status:ContactStatus}){const c=contacts.get(id);if(!c)return undefined;c.status=data.status;contacts.set(id,c);activity("contact.updated","Updated "+c.name+" to "+c.status);return c;}
export function createTask(data:{contactId?:string;title:string;description:string;assignedTo:string;priority:"low"|"medium"|"high"}){
 if(data.contactId&&!contacts.has(data.contactId))throw new Error("CONTACT_NOT_FOUND");
 const now=new Date().toISOString();const task:Task={id:randomUUID(),...data,status:"pending_approval",createdAt:now,updatedAt:now};
 tasks.set(task.id,task);activity("task.created","Task awaits approval: "+task.title);return task;
}
export function listTasks(){return [...tasks.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export function decideTask(id:string,decision:"approved"|"rejected",note=""){
 const task=tasks.get(id);if(!task)return undefined;if(task.status!=="pending_approval")throw new Error("TASK_ALREADY_DECIDED");
 task.status=decision;task.approvalNote=note;task.updatedAt=new Date().toISOString();tasks.set(id,task);
 activity("task."+decision,(decision==="approved"?"Approved ":"Rejected ")+task.title);return task;
}
export function completeTask(id:string){const task=tasks.get(id);if(!task)return undefined;if(task.status!=="approved")throw new Error("TASK_NOT_APPROVED");task.status="completed";task.updatedAt=new Date().toISOString();tasks.set(id,task);activity("task.completed","Completed "+task.title);return task;}
export function addWorkflow(data:Omit<Workflow,"id"|"createdAt">){const item:Workflow={id:randomUUID(),createdAt:new Date().toISOString(),...data};workflows.set(item.id,item);activity("workflow.created","Created "+item.kind+" workflow");return item;}
export function listWorkflows(){return [...workflows.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export function listActivities(){return activities.slice(0,30);}
export function metrics(){const cs=listContacts(),ts=listTasks();return {contacts:cs.length,leads:cs.filter(c=>c.status==="lead").length,qualified:cs.filter(c=>c.status==="qualified").length,customers:cs.filter(c=>c.status==="customer").length,pendingApprovals:ts.filter(t=>t.status==="pending_approval").length,openTasks:ts.filter(t=>t.status==="approved").length,completedTasks:ts.filter(t=>t.status==="completed").length,workflows:workflows.size};}
