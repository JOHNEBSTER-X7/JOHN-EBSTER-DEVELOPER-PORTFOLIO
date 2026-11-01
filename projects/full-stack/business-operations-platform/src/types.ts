export type ContactStatus="lead"|"qualified"|"customer"|"inactive";
export type Contact={id:string;name:string;email:string;company:string;status:ContactStatus;createdAt:string};
export type TaskStatus="pending_approval"|"approved"|"rejected"|"completed";
export type Task={id:string;contactId?:string;title:string;description:string;assignedTo:string;priority:"low"|"medium"|"high";status:TaskStatus;createdAt:string;updatedAt:string;approvalNote?:string};
export type Activity={id:string;type:string;message:string;createdAt:string};
export type Workflow={id:string;contactId?:string;kind:"sales_follow_up"|"support_response"|"research_brief";input:string;recommendation:string;status:TaskStatus;taskId:string;createdAt:string};
