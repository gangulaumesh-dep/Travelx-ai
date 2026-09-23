import React,{useEffect,useState}from"react";import{createRoot}from"react-dom/client";import{Compass,Map,PlusCircle,Sparkles,CalendarDays,Users,Building2,CheckCircle2,Clock3,LogOut,ArrowRight,MapPinned,BriefcaseBusiness,ShieldCheck,Upload,Star}from"lucide-react";import{api,auth}from"./api";import"./style.css";
const R={tourist:["Tourist",Compass,"Discover places, plan trips and share new discoveries."],guide:["Local Guide",MapPinned,"Connect with travellers and offer authentic local experiences."],business:["Business",BriefcaseBusiness,"Showcase your tourism business and manage bookings."],admin:["Tourism Authority",ShieldCheck,"Manage tourism information and verification."]};
function App(){const[u,setU]=useState(()=>JSON.parse(localStorage.getItem("travelx_user")||"null"));const[r,setR]=useState(null),[page,setPage]=useState("home");if(!u)return r?<Auth role={r} back={()=>setR(null)} done={x=>setU(x)}/>:<Roles choose={setR}/>;return <Dash u={u} page={page} nav={setPage} logout={()=>{localStorage.clear();setU(null)}}/>}
function Roles({choose}){return <main className="landing"><div className="brand">TRAVEL<span>X</span> <b>AI</b></div><div className="hero"><small>EXPLORE · EXPERIENCE · EXPAND</small><h1>Travel starts <em>with you.</em></h1><p>Choose how you want to experience the TRAVELX community.</p></div><div className="roles">{Object.entries(R).map(([k,[n,I,d]])=><button onClick={()=>choose(k)} className="role"><div className={"ri "+k}><I/></div><section><h2>{n}</h2><p>{d}</p></section><ArrowRight/></button>)}</div></main>}
function Auth({role,back,done}){const[n,I,d]=R[role],[reg,setReg]=useState(false),[err,setErr]=useState(""),[busy,setBusy]=useState(false);async function go(e){e.preventDefault();setBusy(true);try{const f=new FormData(e.currentTarget),b={email:f.get("email"),password:f.get("password"),role};if(reg)b.name=f.get("name");const x=reg?await auth.register(b):await auth.login(b);localStorage.setItem("travelx_token",x.token);localStorage.setItem("travelx_user",JSON.stringify(x.user));done(x.user)}catch(x){setErr(x.message)}finally{setBusy(false)}}return <main className="auth"><button onClick={back}>← Back</button><div className="authbox"><div className={"ri "+role}><I/></div><small>{n.toUpperCase()}</small><h1>{reg?"Create account":"Welcome back"}</h1><p>{d}</p><div className="tabs"><button className={!reg?"on":""} onClick={()=>setReg(false)}>Login</button>{role!=="admin"&&<button className={reg?"on":""} onClick={()=>setReg(true)}>Register</button>}</div><form onSubmit={go}>{reg&&<input required name="name" placeholder="Full name"/>}<input required name="email" type="email" placeholder="Email"/><input required name="password" minLength="6" type="password" placeholder="Password"/>{err&&<div className="err">{err}</div>}<button className="primary" disabled={busy}>{busy?"Please wait...":reg?"Create Account":"Login"}</button></form>{role!=="admin"&&<p>{reg?"Already registered?":"New to TRAVELX?"} <button className="link" onClick={()=>setReg(!reg)}>{reg?"Login":"Register"}</button></p>}</div></main>}
function Dash({u,page,nav,logout}){
  let menu=u.role==="tourist"
    ?[
      ["home","Home",Compass],
      ["discover","Discover",Map],
      ["new","New Discovery",PlusCircle],
      ["planner","AI Trip Planner",Sparkles],
      ["trips","My Trips",CalendarDays]
    ]
    :u.role==="admin"
    ?[
      ["home","Authority",ShieldCheck],
      ["discover","Discoveries",Map],
      ["verify","Verification",CheckCircle2],
      ["stats","Insights",Users]
    ]
    :[
      ["home","Dashboard",Compass],
      ["discover","Discoveries",Map],
      ["profile","Profile",Users]
    ];

  return (
    <div className="app">

      <aside>
        <div className="sidebrand">
          TRAVEL<span>X</span> <b>AI</b>
        </div>

        <div className="user">
          {u.name?.[0]}
          <span>
            <b>{u.name}</b>
            <small>{R[u.role][0]}</small>
          </span>
        </div>

        {menu.map(([x,t,I])=>(
          <button
            key={x}
            className={page===x?"sel":""}
            onClick={()=>nav(x)}
          >
            <I/>{t}
          </button>
        ))}

        <button className="logout" onClick={logout}>
          <LogOut/>Logout
        </button>
      </aside>

      <main className="main">

        <header>
          <div>
            <small>TRAVELX AI</small>
            <h2>{menu.find(x=>x[0]===page)?.[1]}</h2>
          </div>

          <div className="avatar">
            {u.name?.[0]}
          </div>
        </header>

        {page==="home" &&
          <Home u={u} nav={nav} logout={logout}/>
        }

        {page==="discover" && <Discover nav={nav}/>}
        {page==="new" && <New nav={nav}/>}
        {page==="planner" && <Planner nav={nav}/>}
        {page==="trips" && <Trips/>}
        {page==="verify" && <Verify/>}
        {page==="stats" && <Stats/>}
        {page==="profile" && <Profile u={u}/>}

      </main>
    </div>
  );
}
function Home({u,nav,logout}){
  return (
    <section className="page">

      <div className="welcome">

        <div className="home-top">
          <div>
            <small>{R[u.role][0].toUpperCase()}</small>
            <strong>{u.role.toUpperCase()}</strong>
          </div>

          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>

        <h1>
          {u.role==="tourist" ? "Discover beyond " : "Welcome to "}
          <em>TRAVELX.</em>
        </h1>

        <p>{R[u.role][2]}</p>

        {u.role==="tourist" && (
          <div className="actions">

            <button
              className="primary"
              onClick={()=>nav("discover")}
            >
              Explore Discoveries <ArrowRight/>
            </button>

            <button
              className="secondary"
              onClick={()=>nav("planner")}
            >
              <Sparkles/> Plan with AI
            </button>

          </div>
        )}

      </div>

      <div className="cards">
        {[
          ["Discoveries","Community places",Map],
          ["Trip Planner","AI itineraries",Sparkles],
          ["Community","Local experiences",Users]
        ].map(([a,b,I])=>(
          <button
            className="feature"
            key={a}
            onClick={()=>
              nav(a==="Trip Planner"?"planner":"discover")
            }
          >
            <I/>
            <h3>{a}</h3>
            <p>{b}</p>
            <ArrowRight/>
          </button>
        ))}
      </div>

    </section>
  );
}
function Discover({nav}){const[d,setD]=useState([]);useEffect(()=>{api("/discoveries").then(setD).catch(()=>{})},[]);return <section className="page"><div className="title"><div><small>COMMUNITY DISCOVERIES</small><h1>Beyond the usual <em>map.</em></h1><p>Places shared by travellers and locals.</p></div><button className="primary" onClick={()=>nav("new")}><PlusCircle/> Share Discovery</button></div><div className="grid">{d.length?d.map(x=><article><div className="photo">📍</div><div><small>{x.category||"DISCOVERY"}</small><h3>{x.title||"Community Discovery"}</h3><p>{x.description||"A place shared by the community."}</p><span>{x.latitude}, {x.longitude} · {x.status}</span></div></article>):<Empty nav={nav}/>}</div></section>}
function New({nav}){const[msg,setMsg]=useState(""),[busy,setBusy]=useState(false);async function go(e){e.preventDefault();setBusy(true);try{await api("/discoveries",{method:"POST",body:new FormData(e.currentTarget)});setMsg("success")}catch(x){setMsg(x.message)}finally{setBusy(false)}}if(msg==="success")return <section className="page center"><CheckCircle2/><h1>Discovery submitted!</h1><p>It is waiting for Tourism Authority verification.</p><button className="primary" onClick={()=>nav("discover")}>Back to Discoveries</button></section>;return <section className="page narrow"><button className="backlink" onClick={()=>nav("discover")}>← Back</button><div className="title"><div><small>COMMUNITY DISCOVERY</small><h1>Found something <em>new?</em></h1></div></div><form className="form" onSubmit={go}><label>Photo<input required name="photo" type="file" accept="image/*"/></label><label>Place name<input required name="title" placeholder="Name of the place"/></label><label>Category<select name="category"><option>Hidden Places</option><option>Heritage & Culture</option><option>Nature & Adventure</option><option>Local Food</option></select></label><div className="two"><label>Latitude<input required name="latitude" placeholder="17.6868"/></label><label>Longitude<input required name="longitude" placeholder="83.2185"/></label></div><label>Description<textarea name="description" placeholder="What makes this place special?"/></label>{msg&&<div className="err">{msg}</div>}<div className="notice">Your discovery will be reviewed before it becomes public.</div><button className="primary" disabled={busy}>{busy?"Submitting...":<><Upload/> Submit Discovery</>}</button></form></section>}
function Planner({nav}){
  const [result,setResult]=useState(null);
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);

  async function go(e){
    e.preventDefault();
    setErr("");
    setBusy(true);

    try{
      const f=new FormData(e.currentTarget);

      const x=await api("/trips",{
        method:"POST",
        body:JSON.stringify({
          destination:f.get("destination"),
          start_date:f.get("start") || null,
          end_date:f.get("end") || null,
          budget:f.get("budget") || null,
          interests:[]
        })
      });

      const generated=await api(`/trips/${x.id}/generate`,{
        method:"POST"
      });

      setResult(generated);
    }catch(x){
      setErr(x.message || "Failed to generate trip");
    }finally{
      setBusy(false);
    }
  }

  return (
    <section className="page narrow">
      <button className="backlink" onClick={()=>nav("home")}>
        ← Back
      </button>

      {result ? (
        <div className="result">
          <Sparkles/>
          <small>TRAVELX AI</small>

          <h1>
            Your trip is <em>ready.</em>
          </h1>

          {result.itinerary?.map((d,i)=>(
            <div className="day" key={i}>
              <h3>
                Day {d.day} · {d.title}
              </h3>

              {d.activities?.map((a,j)=>(
                <p key={j}>✓ {a}</p>
              ))}
            </div>
          ))}

          <button
            className="primary"
            onClick={()=>setResult(null)}
          >
            Plan Another Trip
          </button>
        </div>
      ) : (
        <form className="form" onSubmit={go}>
          <div className="title">
            <div>
              <small>TRAVELX AI</small>
              <h1>
                Build your <em>perfect trip.</em>
              </h1>
            </div>
          </div>

          <label>
            Destination
            <input
              required
              name="destination"
              placeholder="e.g. Visakhapatnam"
            />
          </label>

          <div className="two">
            <label>
              Start
              <input name="start" type="date"/>
            </label>

            <label>
              End
              <input name="end" type="date"/>
            </label>
          </div>

          <label>
            Budget
            <input
              name="budget"
              placeholder="e.g. 10000"
            />
          </label>

          {err && (
            <div className="err">
              {err}
            </div>
          )}

          <button
            type="submit"
            className="primary"
            disabled={busy}
          >
            <Sparkles/>
            {busy ? "Generating..." : "Generate My Trip"}
          </button>
        </form>
      )}
    </section>
  );
}
function Trips(){const[d,setD]=useState([]);useEffect(()=>{api("/trips").then(setD).catch(()=>{})},[]);return <section className="page"><div className="title"><div><small>MY TRIPS</small><h1>Your travel <em>stories.</em></h1></div></div>{d.map(x=><article className="trip"><CalendarDays/><div><b>{x.destination}</b><p>{x.start_date||"Flexible"} → {x.end_date||"Open"}</p></div><span>{x.status}</span></article>)}</section>}
function Verify(){const[d,setD]=useState([]),load=()=>api("/discoveries").then(x=>setD(x.filter(y=>y.status==="pending")));useEffect(()=>{load()},[]);async function act(id,status){await api(`/discoveries/${id}/verify`,{method:"PATCH",body:JSON.stringify({status})});load()}return <section className="page"><div className="title"><div><small>AUTHORITY</small><h1>Verification <em>queue.</em></h1></div></div>{d.length?d.map(x=><article className="verify"><div><b>{x.title}</b><p>{x.description}</p><small>{x.submitted_by} · {x.latitude}, {x.longitude}</small></div><div><button className="approve" onClick={()=>act(x.id,"approved")}>Approve</button><button className="reject" onClick={()=>act(x.id,"rejected")}>Reject</button></div></article>):<Empty/>}</section>}
function Stats(){const[d,setD]=useState({});useEffect(()=>{api("/admin/stats").then(setD).catch(()=>{})},[]);return <section className="page"><div className="welcome"><small>PLATFORM INSIGHTS</small><h1>TRAVELX at a <em>glance.</em></h1></div><div className="cards"><Metric t="Users" v={d.users??"—"} I={Users}/><Metric t="Pending" v={d.pendingDiscoveries??"—"} I={Clock3}/><Metric t="Places" v={d.publishedPlaces??"—"} I={Map}/></div></section>}
function Metric({t,v,I}){return <div className="metric"><I/><small>{t}</small><b>{v}</b></div>}function Profile({u}){return <section className="page center"><div className="avatar big">{u.name?.[0]}</div><h1>{u.name}</h1><p>{u.email}</p><span>{R[u.role][0]}</span></section>}function Empty({nav}){return <div className="empty"><Map/><h3>No discoveries yet</h3><p>Be the first to share a place.</p>{nav&&<button className="primary" onClick={()=>nav("new")}>Add Discovery</button>}</div>}
createRoot(document.getElementById("root")).render(<App/>);