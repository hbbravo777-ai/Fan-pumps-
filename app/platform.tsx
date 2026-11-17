"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "../lib/supabase/client";

type Profile = { id: string; username: string; display_name: string; bio: string | null; avatar_url: string | null; is_creator: boolean; created_at: string };
type Post = { id: string; creator_id: string; body: string; created_at: string; profiles?: { username: string; display_name: string } | null };

export default function Platform() {
  const supabase = useMemo(() => {
    try { return createClient(); } catch { return null; }
  }, []);
  const [configured, setConfigured] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [postBody, setPostBody] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!supabase) { setConfigured(false); return; }
    const { data: auth } = await supabase.auth.getSession();
    setSession(auth.session);
    const { data: creators } = await supabase.from("profiles").select("*").eq("is_creator", true).order("created_at", { ascending: false }).limit(30);
    setProfiles(creators ?? []);
    const { data: feed } = await supabase.from("posts").select("id,creator_id,body,created_at").eq("visibility", "public").order("created_at", { ascending: false }).limit(30);
    setPosts(feed ?? []);
    if (auth.session) {
      const { data: rows } = await supabase.from("follows").select("creator_id").eq("follower_id", auth.session.user.id);
      setFollowing((rows ?? []).map((x: any) => x.creator_id));
    }
  }

  useEffect(() => {
    if (!supabase) { setConfigured(false); return; }
    refresh();
    const { data: listener } = supabase.auth.onAuthStateChange(() => { refresh(); });
    return () => listener.subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  async function authenticate(e: FormEvent) {
    e.preventDefault(); if (!supabase) return; setBusy(true); setNotice("");
    const result = mode === "signup"
      ? await supabase.auth.signUp({ email, password, options: { data: { username, display_name: displayName } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) setNotice(result.error.message);
    else setNotice(mode === "signup" ? "Account created. Check your email if confirmation is enabled, then sign in." : "Signed in.");
    await refresh();
  }

  async function saveCreator(e: FormEvent) {
    e.preventDefault(); if (!supabase || !session) return; setBusy(true);
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0,24);
    const { error } = await supabase.from("profiles").upsert({ id: session.user.id, username: clean, display_name: displayName.trim() || clean, bio, is_creator: true }, { onConflict: "id" });
    setBusy(false); setNotice(error ? error.message : "Creator profile saved."); await refresh();
  }

  async function toggleFollow(id: string) {
    if (!supabase || !session) { setNotice("Sign in to follow creators."); return; }
    const exists = following.includes(id);
    const result = exists
      ? await supabase.from("follows").delete().eq("follower_id", session.user.id).eq("creator_id", id)
      : await supabase.from("follows").insert({ follower_id: session.user.id, creator_id: id });
    if (result.error) setNotice(result.error.message);
    else setFollowing(old => exists ? old.filter(x => x !== id) : [...old, id]);
  }

  async function publishPost(e: FormEvent) {
    e.preventDefault(); if (!supabase || !session || !postBody.trim()) return;
    const { error } = await supabase.from("posts").insert({ creator_id: session.user.id, body: postBody.trim(), visibility: "public" });
    setNotice(error ? error.message : "Post published."); setPostBody(""); await refresh();
  }

  return <main className="platform">
    <header className="platformHeader"><a className="logo" href="/">EXTREME<span> PUMPS</span></a><nav><a href="#discover">Discover</a><a href="#feed">Feed</a><a href="#creator">Creator studio</a></nav><div>{session ? <><span className="signedIn">{session.user.email}</span><button className="smallButton" onClick={async()=>{await supabase?.auth.signOut(); await refresh();}}>Log out</button></> : <a className="smallButton" href="#account">Sign in</a>}</div></header>
    <section className="platformHero"><div><small>THE CREATOR ECONOMY, ON SOLANA</small><h1>Make your community<br/><em>part of the pump.</em></h1><p>Follow creators, publish updates and build a community. Token-gated access and livestream payments will activate after the on-chain payment verifier is deployed and audited.</p><a className="cta" href="#discover">Discover creators</a></div><div className="heroOrb"><b>EP</b><span>CREATE · CONNECT · PUMP</span></div></section>
    {notice && <div className="notice" role="status">{notice}</div>}
    {!configured && <div className="setupNotice"><b>Backend setup required.</b> Add your Supabase project URL and anon key to the hosting environment, then run <code>supabase/migrations/001_initial.sql</code> in the Supabase SQL editor. The app will connect to real accounts and persistent data.</div>}
    <div className="platformGrid">
      <aside className="sideNav"><a href="#discover">✦ Discover</a><a href="#feed">▤ Community feed</a><a href="#creator">＋ Creator studio</a><a href="#account">◎ Account</a><a href="#wallet">◈ Wallet</a><div className="sideCard"><b>Creator coins</b><p>Wallet transactions remain disabled until payment verification and security review are complete.</p></div></aside>
      <div className="mainColumn">
        <section id="account" className="panel">
          <div className="sectionHead"><div><small>YOUR ACCOUNT</small><h2>{session ? "You're signed in" : "Join the community"}</h2></div><span className="statusPill">{session ? "CONNECTED" : "EMAIL AUTH"}</span></div>
          {session ? <p>Signed in as <b>{session.user.email}</b>. Your account is ready to follow creators and manage your profile.</p> : <form className="authForm" onSubmit={authenticate}><div className="modeSwitch"><button type="button" className={mode==="signup"?"active":""} onClick={()=>setMode("signup")}>Create account</button><button type="button" className={mode==="signin"?"active":""} onClick={()=>setMode("signin")}>Sign in</button></div>{mode==="signup" && <><input required placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)}/><input required placeholder="Display name" value={displayName} onChange={e=>setDisplayName(e.target.value)}/></>}<input required type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)}/><input required minLength={8} type="password" placeholder="Password (8+ characters)" value={password} onChange={e=>setPassword(e.target.value)}/><button className="cta" disabled={busy || !configured}>{busy ? "Please wait…" : mode==="signup" ? "Create account" : "Sign in"}</button><small className="muted">Email/password authentication is provided by your configured Supabase project.</small></form>}
        </section>
        <section id="discover"><div className="sectionHead"><div><small>FIND YOUR PEOPLE</small><h2>Creator discovery</h2></div><span className="count">{profiles.length} creators</span></div><div className="creatorGrid">{profiles.length ? profiles.map(p=><article className="creatorCard" key={p.id}><div className="creatorAvatar">{(p.display_name||p.username).slice(0,1).toUpperCase()}</div><h3>{p.display_name}</h3><span className="handle">@{p.username}</span><p>{p.bio || "Building a community on Extreme Pumps."}</p><button onClick={()=>toggleFollow(p.id)}>{following.includes(p.id)?"Following":"＋ Follow"}</button></article>) : <div className="emptyState">Creator profiles will appear here when users create them. Be the first to set up a creator profile below.</div>}</div></section>
        <section id="feed"><div className="sectionHead"><div><small>COMMUNITY</small><h2>Latest posts</h2></div></div>{session && <form className="postComposer" onSubmit={publishPost}><textarea placeholder="Share something with your community…" value={postBody} onChange={e=>setPostBody(e.target.value)} maxLength={2000}/><button className="cta" disabled={!postBody.trim()}>Publish post</button></form>}<div className="postList">{posts.length ? posts.map(p=><article className="postCard" key={p.id}><small>CREATOR UPDATE</small><p>{p.body}</p><span>{new Date(p.created_at).toLocaleString()}</span></article>) : <div className="emptyState">No public posts yet.</div>}</div></section>
        <section id="creator" className="panel"><small>CREATOR STUDIO</small><h2>Set up your creator profile</h2>{session ? <form className="authForm" onSubmit={saveCreator}><input required placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)}/><input placeholder="Display name" value={displayName} onChange={e=>setDisplayName(e.target.value)}/><textarea placeholder="Tell fans what you create…" value={bio} onChange={e=>setBio(e.target.value)} maxLength={500}/><button className="cta" disabled={busy}>Save creator profile</button></form> : <p>Sign in first to create your profile.</p>}</section>
        <section id="wallet" className="panel walletPanel"><small>SOLANA WALLET</small><h2>Non-custodial by design</h2><p>Wallet connection and token transfers are not enabled in this build. The next integration will connect Phantom/Solflare, verify signed transactions server-side on Devnet, and issue stream entitlements only after finalized payment checks.</p><span className="statusPill">DEVNET INTEGRATION PENDING</span></section>
      </div>
    </div>
    <footer>EXTREME PUMPS · Creator platform beta · Never share your seed phrase or private key.</footer>
  </main>;
}
