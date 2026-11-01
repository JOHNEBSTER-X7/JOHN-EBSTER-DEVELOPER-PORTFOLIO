import type {Environment,Service} from "./types";
export function readinessChecks(service:Service,environment:Environment,version:string){
 const checks:string[]=[];
 if(!/^\d+\.\d+\.\d+([+-][a-zA-Z0-9.-]+)?$/.test(version))checks.push("Version must use semantic version format.");
 if(service.health!=="healthy")checks.push("Service health is not healthy.");
 if(environment==="production"&&!/^\d+\.\d+\.\d+$/.test(version))checks.push("Production releases require a stable semantic version.");
 return checks;
}
