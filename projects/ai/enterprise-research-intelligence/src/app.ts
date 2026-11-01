import express,{NextFunction,Request,Response} from "express";
import helmet from "helmet";
import multer from "multer";
import {rateLimit} from "express-rate-limit";
import {z} from "zod";
import pdfParse from "pdf-parse";
import {addDocument,listDocuments} from "./retrieval";
import {getReport,listReports,runResearch} from "./research-service";
export const app=express();app.use(helmet());app.use(express.json({limit:"32kb"}));app.use(express.static("public"));
const limiter=rateLimit({windowMs:60000,limit:15,standardHeaders:"draft-8",legacyHeaders:false});
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:Number(process.env.MAX_UPLOAD_BYTES||5242880)}});
const schema=z.object({query:z.string().trim().min(8).max(1500)});
app.get("/api/health",(_req,res)=>res.json({status:"ok",service:"northstar-enterprise-research"}));
app.get("/api/documents",(_req,res)=>res.json(listDocuments()));
app.post("/api/documents",upload.single("file"),async(req,res,next)=>{
 try{
 if(!req.file)return res.status(400).json({error:"Upload a PDF, TXT or Markdown file."});
 const filename=req.file.originalname.replace(/[\/\\\\]/g,"_");const ext=filename.toLowerCase().split(".").pop();let text:string;
 if(ext==="txt"||ext==="md")text=req.file.buffer.toString("utf8");
 else if(ext==="pdf"){const parsed=await pdfParse(req.file.buffer);text=parsed.text;}
 else return res.status(415).json({error:"Only PDF, TXT and Markdown files are supported."});
 if(!text.trim())return res.status(422).json({error:"No extractable text found in the uploaded file."});
 return res.status(201).json(addDocument(filename,text));
 }catch(error){return next(error);}
});
app.post("/api/research",limiter,async(req,res,next)=>{
 try{const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid research question.",details:parsed.error.flatten()});return res.status(201).json(await runResearch(parsed.data.query));}
 catch(error){return next(error);}
});
app.get("/api/reports",(_req,res)=>res.json(listReports().map(({id,query,createdAt,status,researchMode,sources})=>({id,query,createdAt,status,researchMode,sourceCount:sources.length}))));
app.get("/api/reports/:id",(req,res)=>{const report=getReport(req.params.id);if(!report)return res.status(404).json({error:"Report not found."});return res.json(report);});
app.get("/api/reports/:id/export",(req,res)=>{const report=getReport(req.params.id);if(!report)return res.status(404).json({error:"Report not found."});res.setHeader("Content-Type","text/markdown; charset=utf-8");res.setHeader("Content-Disposition",'attachment; filename="research-report-'+report.id+'.md"');return res.send(report.reportMarkdown);});
app.use((error:unknown,_req:Request,res:Response,_next:NextFunction)=>{const message=error instanceof Error?error.message:"Unexpected server error.";const status=error instanceof multer.MulterError?413:500;res.status(status).json({error:status===413?"Upload exceeds the configured size limit.":"Internal server error.",detail:process.env.NODE_ENV==="development"?message:undefined});});
