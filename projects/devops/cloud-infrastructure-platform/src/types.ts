export type Environment="development"|"staging"|"production";
export type DeploymentStatus="pending_approval"|"approved"|"rejected"|"deployed"|"failed";
export type Service={id:string;name:string;description:string;owner:string;health:"healthy"|"degraded"|"unknown";version:string};
export type Deployment={id:string;serviceId:string;environment:Environment;version:string;requestedBy:string;status:DeploymentStatus;checks:string[];createdAt:string;updatedAt:string;note?:string};
export type Event={id:string;type:string;message:string;createdAt:string};
