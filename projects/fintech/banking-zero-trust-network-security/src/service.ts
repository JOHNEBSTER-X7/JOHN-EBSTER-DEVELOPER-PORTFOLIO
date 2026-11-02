import {randomUUID,createHash} from "node:crypto";
export type Zone="internet"|"dmz"|"application"|"database"|"admin"|"third_party";
export type Decision="allow"|"deny";
type Device={id:string;name:string;owner:string;managed:boolean;compliant:boolean;trustScore:number;lastAssessment:string;status:"trusted"|"restricted"|"blocked"};
type ServiceIdentity={id:string;name:string;spiffeId:string;zone:Zone;active:boolean;createdAt:string};
type NetworkPolicy={id:string;name:string;sourceZone:Zone;destinationZone:Zone;serviceIdentityId?:string;deviceRequired:boolean;minimumTrust:number;ports:number[];decision:Decision;enabled:boolean;reason:string;createdAt:string};
type Flow={id:string;sourceZone:Zone;destinationZone:Zone;source:string;destination:string;port:number;protocol:"tcp"|"udp";deviceId?:string;serviceIdentityId?:string;occurredAt:string;decision:Decision;reasons:string[];policyId?:string};
type Audit={id:string;actor:string;action:string;target:string;detail:string;at:string};
const zones:Zone[]=["internet","dmz","application","database","admin","third_party"];
export class ZeroTrustService{
 private devices:Device[]=[];private identities:ServiceIdentity[]=[];private policies:NetworkPolicy[]=[];private flows:Flow[]=[];private audit:Audit[]=[];
 private log(actor:string,action:string,target:string,detail:string){this.audit.unshift({id:randomUUID(),actor,action,target,detail,at:new Date().toISOString()});}
 registerDevice(input:{name:string;owner:string;managed:boolean;compliant:boolean}){const trustScore=(input.managed?40:0)+(input.compliant?40:0)+20;const d:Device={...input,id:randomUUID(),trustScore,lastAssessment:new Date().toISOString(),status:trustScore>=80?"trusted":trustScore>=40?"restricted":"blocked"};this.devices.push(d);this.log("device-registry","device.registered",d.id,d.name);return d;}
 listDevices(){return this.devices;}
 assessDevice(id:string,input:{managed:boolean;compliant:boolean;actor:string}){const d=this.devices.find(x=>x.id===id);if(!d)throw Error("Device not found");d.managed=input.managed;d.compliant=input.compliant;d.trustScore=(input.managed?40:0)+(input.compliant?40:0)+20;d.status=d.trustScore>=80?"trusted":d.trustScore>=40?"restricted":"blocked";d.lastAssessment=new Date().toISOString();this.log(input.actor,"device.assessed",id,"trust="+d.trustScore);return d;}
 registerService(input:{name:string;spiffeId:string;zone:Zone}){if(this.identities.some(x=>x.spiffeId===input.spiffeId))throw Error("Service identity already exists");const s:ServiceIdentity={...input,id:randomUUID(),active:true,createdAt:new Date().toISOString()};this.identities.push(s);this.log("identity-admin","service_identity.created",s.id,s.spiffeId);return s;}
 listServiceIdentities(){return this.identities;}
 setServiceIdentityStatus(id:string,active:boolean,actor:string){const s=this.identities.find(x=>x.id===id);if(!s)throw Error("Service identity not found");s.active=active;this.log(actor,"service_identity.updated",id,"active="+active);return s;}
 addPolicy(input:{name:string;sourceZone:Zone;destinationZone:Zone;serviceIdentityId?:string;deviceRequired:boolean;minimumTrust:number;ports:number[];decision:Decision;reason:string}){if(input.minimumTrust<0||input.minimumTrust>100)throw Error("Minimum trust must be 0-100");if(input.ports.some(p=>!Number.isInteger(p)||p<1||p>65535))throw Error("Ports must be valid TCP/UDP port numbers");if(input.serviceIdentityId&&!this.identities.some(s=>s.id===input.serviceIdentityId))throw Error("Service identity not found");const p:NetworkPolicy={...input,id:randomUUID(),enabled:true,createdAt:new Date().toISOString()};this.policies.push(p);this.log("policy-admin","policy.created",p.id,p.name);return p;}
 listPolicies(){return this.policies;}
 setPolicyEnabled(id:string,enabled:boolean,actor:string){const p=this.policies.find(x=>x.id===id);if(!p)throw Error("Policy not found");p.enabled=enabled;this.log(actor,"policy.updated",id,"enabled="+enabled);return p;}
 evaluateFlow(input:{sourceZone:Zone;destinationZone:Zone;source:string;destination:string;port:number;protocol:"tcp"|"udp";deviceId?:string;serviceIdentityId?:string}){const reasons:string[]=[];const device=input.deviceId?this.devices.find(d=>d.id===input.deviceId):undefined;const identity=input.serviceIdentityId?this.identities.find(s=>s.id===input.serviceIdentityId):undefined;let matched:NetworkPolicy|undefined;
 if(input.deviceId&&!device)reasons.push("Device is not registered");
 if(input.deviceId&&device?.status==="blocked")reasons.push("Device trust status is blocked");
 if(input.serviceIdentityId&&(!identity||!identity.active))reasons.push("Service identity is unknown or inactive");
 if(identity&&identity.zone!==input.sourceZone)reasons.push("Service identity zone does not match flow source zone");
 const candidates=this.policies.filter(p=>p.enabled&&p.sourceZone===input.sourceZone&&p.destinationZone===input.destinationZone&&p.ports.includes(input.port)&&(!p.serviceIdentityId||p.serviceIdentityId===input.serviceIdentityId));
 matched=candidates.find(p=>(!p.deviceRequired||!!device)&&(!p.deviceRequired||!!device&&device.trustScore>=p.minimumTrust));
 let decision:Decision="deny";
 if(reasons.length===0&&matched){if(matched.decision==="allow"){if(matched.deviceRequired&&(!device||device.trustScore<matched.minimumTrust))reasons.push("Device trust below policy minimum");else decision="allow";}else reasons.push("Matched policy explicitly denies this flow");}
 else if(reasons.length===0)reasons.push("No matching allow policy; default deny");
 if(matched&&matched.decision==="deny")decision="deny";
 if(matched&&matched.deviceRequired&&(!device||device.trustScore<matched.minimumTrust)){decision="deny";if(!reasons.includes("Device trust below policy minimum"))reasons.push("Device trust below policy minimum");}
 const f:Flow={...input,id:randomUUID(),occurredAt:new Date().toISOString(),decision,reasons,policyId:matched?.id};this.flows.unshift(f);this.log("policy-engine","network.flow_evaluated",f.id,decision+":"+input.source+"->"+input.destination);return f;}
 listFlows(){return this.flows;}
 simulateSegmentationCheck(){const matrix:Record<Zone,Zone[]>={internet:["dmz"],dmz:["application"],application:["database"],database:[],admin:["application","database"],third_party:["dmz"]};return zones.map(source=>({source,allowedDestinations:matrix[source],default:"deny" as Decision}));}
 summary(){return {devices:this.devices.length,trustedDevices:this.devices.filter(d=>d.status==="trusted").length,serviceIdentities:this.identities.filter(s=>s.active).length,enabledPolicies:this.policies.filter(p=>p.enabled).length,flows:this.flows.length,allowedFlows:this.flows.filter(f=>f.decision==="allow").length,deniedFlows:this.flows.filter(f=>f.decision==="deny").length};}
 auditTrail(){return this.audit;}
 fingerprint(value:string){return createHash("sha256").update(value).digest("hex");}
}