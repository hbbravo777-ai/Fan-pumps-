import {createClient} from "npm:@supabase/supabase-js@2";
import {importPKCS8,SignJWT} from "npm:jose@5.9.6";
const cors={"Access-Control-Allow-Origin":Deno.env.get("APP_ALLOWED_ORIGIN")??"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Vary":"Origin"};
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return Response.json({error:"Method not allowed"},{status:405,headers:cors});
 try{
  const auth=req.headers.get("Authorization");if(!auth?.startsWith("Bearer "))return Response.json({error:"Unauthorized"},{status:401,headers:cors});
  const url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),kid=Deno.env.get("MUX_SIGNING_KEY_ID"),pemRaw=Deno.env.get("MUX_SIGNING_KEY_PRIVATE_KEY");
  if(!url||!anon||!service||!kid||!pemRaw)throw new Error("Server playback configuration missing");
  const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}},auth:{persistSession:false}});
  const {data:u,error:ue}=await userClient.auth.getUser();if(ue||!u.user)return Response.json({error:"Unauthorized"},{status:401,headers:cors});
  const body=await req.json().catch(()=>({}));const id=typeof body.streamId==="string"?body.streamId:"";if(!/^[0-9a-f-]{36}$/i.test(id))return Response.json({error:"Invalid stream ID"},{status:400,headers:cors});
  const admin=createClient(url,service,{auth:{persistSession:false}});const {data:s,error}=await admin.from("live_streams").select("mux_playback_id,status").eq("id",id).maybeSingle();
  if(error||!s||s.status!=="live"||!s.mux_playback_id)return Response.json({error:"Stream unavailable"},{status:404,headers:cors});
  const key=await importPKCS8(pemRaw.replace(/\\n/g,"\n"),"RS256");
  const token=await new SignJWT({aud:"v",sub:s.mux_playback_id}).setProtectedHeader({alg:"RS256",kid,typ:"JWT"}).setIssuedAt().setExpirationTime("5m").sign(key);
  return Response.json({playbackUrl:`https://stream.mux.com/${s.mux_playback_id}.m3u8?token=${token}`},{headers:{...cors,"Cache-Control":"no-store"}});
 }catch(e){console.error("playback authorization failed",e);return Response.json({error:"Playback authorization failed"},{status:500,headers:cors})}
});