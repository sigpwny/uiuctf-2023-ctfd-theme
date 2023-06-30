import{m as o,C as i,h as g,T as p,d as C,M as l,c as d}from"./index.5a84c1a7.js";import{g as v,e as h}from"./index.4d677054.js";import{s as r,c as f}from"./clipboard.f24da0ba.js";import{g as c}from"./userscore.183e251d.js";import"./echarts.128204f2.js";function u(e){let s=new DOMParser().parseFromString(e,"text/html");return s.querySelectorAll('a[href*="://"]').forEach(n=>{n.setAttribute("target","_blank")}),s.documentElement.outerHTML}window.Alpine=o;window.CTFd=i;o.store("challenge",{data:{view:""}});o.data("Hint",()=>({id:null,html:null,async showHint(e){if(e.target.open){let s=(await i.pages.challenge.loadHint(this.id)).data;if(s.content)this.html=u(s.html);else if(await i.pages.challenge.displayUnlock(this.id)){let n=await i.pages.challenge.loadUnlock(this.id);if(n.success){let w=(await i.pages.challenge.loadHint(this.id)).data;this.html=u(w.html)}else e.target.open=!1,i._functions.challenge.displayUnlockError(n)}else e.target.open=!1}}}));o.data("Challenge",()=>({id:null,next_id:null,submission:"",tab:null,solves:[],response:null,async init(){g()},getStyles(){let e={"modal-dialog":!0};try{switch(i.config.themeSettings.challenge_window_size){case"sm":e["modal-sm"]=!0;break;case"lg":e["modal-lg"]=!0;break;case"xl":e["modal-xl"]=!0;break;default:break}}catch(t){console.log("Error processing challenge_window_size"),console.log(t)}return e},async init(){g()},async showChallenge(){new p(this.$el).show()},async showSolves(){this.solves=await i.pages.challenge.loadSolves(this.id),this.solves.forEach(e=>(e.date=C(e.date).format("MMMM Do, h:mm:ss A"),e)),new p(this.$el).show()},async loadSolves(){this.solves=await i.pages.challenge.loadSolves(this.id)},getNextId(){return o.store("challenge").data.next_id},async nextChallenge(){let e=l.getOrCreateInstance("[x-ref='challengeWindow']");e._element.addEventListener("hidden.bs.modal",t=>{o.nextTick(()=>{this.$dispatch("load-challenge",this.getNextId())})},{once:!0}),e.hide()},async submitChallenge(){this.response=await i.pages.challenge.submitChallenge(this.id,this.submission),await this.renderSubmissionResponse()},async renderSubmissionResponse(){this.response&&this.response.data.status==="correct"&&(this.submission=""),this.$dispatch("load-challenges"),this.$dispatch("render-status-popup")}}));o.data("ChallengeBoard",()=>({loaded:!1,challenges:[],challenge:null,async init(){if(this.challenges=await i.pages.challenges.getChallenges(),this.loaded=!0,window.location.hash){let e=decodeURIComponent(window.location.hash.substring(1)),t=e.lastIndexOf("-");if(t>=0){let a=[e.slice(0,t),e.slice(t+1)][1];await this.loadChallenge(a)}}},getCategories(){const e=[];this.challenges.forEach(t=>{const{category:s}=t;e.includes(s)||e.push(s)});try{const t=i.config.themeSettings.challenge_category_order;if(t){const s=new Function(`return (${t})`);e.sort(s())}}catch(t){console.log("Error running challenge_category_order function"),console.log(t)}return e},getChallenges(e){let t=this.challenges;e&&(t=this.challenges.filter(s=>s.category===e));try{const s=i.config.themeSettings.challenge_order;if(s){const a=new Function(`return (${s})`);t.sort(a())}}catch(s){console.log("Error running challenge_order function"),console.log(s)}return t},async loadChallenges(){this.challenges=await i.pages.challenges.getChallenges()},async loadChallenge(e){await i.pages.challenge.displayChallenge(e,t=>{t.data.view=u(t.data.view),o.store("challenge").data=t.data,o.nextTick(()=>{let s=l.getOrCreateInstance("[x-ref='challengeWindow']");s._element.addEventListener("hidden.bs.modal",a=>{history.replaceState(null,null," ")},{once:!0}),s.show(),history.replaceState(null,null,`#${t.data.name}-${e}`)})})}}));o.data("ScoreboardDetail",()=>({data:null,async init(){this.data=await i.pages.scoreboard.getScoreboardDetail(10);let e=v(i.config.userMode,this.data);h(this.$refs.scoregraph,e)}}));o.data("SettingsForm",()=>({success:null,error:null,initial:null,errors:[],init(){this.initial=r(this.$el)},async updateProfile(){this.success=null,this.error=null,this.errors=[];let e=r(this.$el,this.initial,!0);e.fields=[];for(const s in e)if(s.match(/fields\[\d+\]/)){let a={},n=parseInt(s.slice(7,-1));a.field_id=n,a.value=e[s],e.fields.push(a),delete e[s]}const t=await i.pages.settings.updateSettings(e);t.success?(this.success=!0,this.error=!1,setTimeout(()=>{this.success=null,this.error=null},3e3)):(this.success=!1,this.error=!0,Object.keys(t.errors).map(s=>{const a=t.errors[s];this.errors.push(a)}))}}));o.data("TokensForm",()=>({token:null,async generateToken(){const e=r(this.$el);e.expiration||delete e.expiration;const t=await i.pages.settings.generateToken(e);this.token=t.data.value,new l(this.$refs.tokenModal).show()},copyToken(){f(this.$refs.token)}}));o.data("Tokens",()=>({selectedTokenId:null,async deleteTokenModal(e){this.selectedTokenId=e,new l(this.$refs.confirmModal).show()},async deleteSelectedToken(){await i.pages.settings.deleteToken(this.selectedTokenId);const e=this.$refs[`token-${this.selectedTokenId}`];e&&e.remove()}}));o.data("UserGraphs",()=>({solves:null,fails:null,awards:null,user:{},solveCount:0,failCount:0,awardCount:0,getSolvePercentage(){return(this.solveCount/(this.solveCount+this.failCount)*100).toFixed(2)},getFailPercentage(){return(this.failCount/(this.solveCount+this.failCount)*100).toFixed(2)},getCategoryBreakdown(){const e=[],t={};this.solves.data.map(a=>{e.push(a.challenge.category)}),e.forEach(a=>{a in t?t[a]+=1:t[a]=1});const s=[];for(const a in t){const n=Number(t[a]/e.length*100).toFixed(2);s.push({name:a,count:t[a],color:d(a),percent:n})}return s},async init(){this.solves=await i.pages.users.userSolves("me"),this.fails=await i.pages.users.userFails("me"),this.awards=await i.pages.users.userAwards("me");const e=await i.fetch("/api/v1/users/me",{method:"GET"});this.user=await e.json(),this.solveCount=this.solves.meta.count,this.failCount=this.fails.meta.count,this.awardCount=this.awards.meta.count,h(this.$refs.scoregraph,c(i.user.id,i.user.name,this.solves.data,this.awards.data))}}));o.store("inviteToken","");o.data("TeamEditModal",()=>({success:null,error:null,initial:null,errors:[],init(){this.initial=r(this.$el.querySelector("form"))},async updateProfile(){let e=r(this.$el,this.initial,!0);e.fields=[];for(const s in e)if(s.match(/fields\[\d+\]/)){let a={},n=parseInt(s.slice(7,-1));a.field_id=n,a.value=e[s],e.fields.push(a),delete e[s]}let t=await i.pages.teams.updateTeamSettings(e);t.success?(this.success=!0,this.error=!1,setTimeout(()=>{this.success=null,this.error=null},3e3)):(this.success=!1,this.error=!0,Object.keys(t.errors).map(s=>{const a=t.errors[s];this.errors.push(a)}))}}));o.data("TeamCaptainModal",()=>({success:null,error:null,errors:[],async updateCaptain(){let e=r(this.$el,null,!0),t=await i.pages.teams.updateTeamSettings(e);t.success?window.location.reload():(this.success=!1,this.error=!0,Object.keys(t.errors).map(s=>{const a=t.errors[s];this.errors.push(a)}))}}));o.data("TeamInviteModal",()=>({copy(){f(this.$refs.link)}}));o.data("TeamDisbandModal",()=>({errors:[],async disbandTeam(){let e=await i.pages.teams.disbandTeam();e.success?window.location.reload():this.errors=e.errors[""]}}));o.data("CaptainMenu",()=>({captain:!1,editTeam(){this.teamEditModal=new l(document.getElementById("team-edit-modal")),this.teamEditModal.show()},chooseCaptain(){this.teamCaptainModal=new l(document.getElementById("team-captain-modal")),this.teamCaptainModal.show()},async inviteMembers(){const e=await i.pages.teams.getInviteToken();if(e.success){const t=e.data.code,s=`${window.location.origin}${i.config.urlRoot}/teams/invite?code=${t}`;document.querySelector("#team-invite-modal input[name=link]").value=s,this.$store.inviteToken=s,this.teamInviteModal=new l(document.getElementById("team-invite-modal")),this.teamInviteModal.show()}},disbandTeam(){this.teamDisbandModal=new l(document.getElementById("team-disband-modal")),this.teamDisbandModal.show()}}));o.data("TeamGraphs",()=>({solves:null,fails:null,awards:null,solveCount:0,failCount:0,awardCount:0,getSolvePercentage(){return(this.solveCount/(this.solveCount+this.failCount)*100).toFixed(2)},getFailPercentage(){return(this.failCount/(this.solveCount+this.failCount)*100).toFixed(2)},getCategoryBreakdown(){const e=[],t={};this.solves.data.map(a=>{e.push(a.challenge.category)}),e.forEach(a=>{a in t?t[a]+=1:t[a]=1});const s=[];for(const a in t)s.push({name:a,count:t[a],percent:t[a]/e.length*100,color:d(a)});return s},async init(){this.solves=await i.pages.teams.teamSolves("me"),this.fails=await i.pages.teams.teamFails("me"),this.awards=await i.pages.teams.teamAwards("me"),this.solveCount=this.solves.meta.count,this.failCount=this.fails.meta.count,this.awardCount=this.awards.meta.count,h(this.$refs.scoregraph,c(i.team.id,i.team.name,this.solves.data,this.awards.data))}}));const y=e=>({solves:null,fails:null,awards:null,members:{},team:{},solveCount:0,failCount:0,awardCount:0,getSolvePercentage(){return(this.solveCount/(this.solveCount+this.failCount)*100).toFixed(2)},getFailPercentage(){return(this.failCount/(this.solveCount+this.failCount)*100).toFixed(2)},getCategoryBreakdown(){const t=[],s={};this.solves.data.map(n=>{t.push(n.challenge.category)}),t.forEach(n=>{n in s?s[n]+=1:s[n]=1});const a=[];for(const n in s)a.push({name:n,count:s[n],percent:(s[n]/t.length*100).toFixed(2),color:d(n)});return a},async init(){this.solves=await i.pages.teams.teamSolves(e),this.fails=await i.pages.teams.teamFails(e),this.awards=await i.pages.teams.teamAwards(e);const t=await i.fetch(`/api/v1/teams/${e}/members`,{method:"GET"});this.members=await t.json();const s=await i.fetch(`/api/v1/teams/${e}`,{method:"GET"});this.team=await s.json(),this.solveCount=this.solves.meta.count,this.failCount=this.fails.meta.count,this.awardCount=this.awards.meta.count,h(this.$refs.scoregraph,c(e,this.team.data.name,this.solves.data,this.awards.data))}});o.data("TeamGraphsPublic",e=>y(e));const k=e=>({solves:null,fails:null,awards:null,user:null,team:null,solveCount:0,failCount:0,awardCount:0,getSolvePercentage(){return(this.solveCount/(this.solveCount+this.failCount)*100).toFixed(2)},getFailPercentage(){return(this.failCount/(this.solveCount+this.failCount)*100).toFixed(2)},getCategoryBreakdown(){const t=[],s={};this.solves.map(n=>{t.push(n.challenge.category)}),t.forEach(n=>{n in s?s[n]+=1:s[n]=1});const a=[];for(const n in s){const m=Number(s[n]/t.length*100).toFixed(2);a.push({name:n,count:s[n],color:d(n),percent:m})}return a},async init(){this.solves=await i.pages.users.userSolves(e),this.fails=await i.pages.users.userFails(e),this.awards=await i.pages.users.userAwards(e);const t=await i.fetch(`/api/v1/users/${e}`,{method:"GET"});if(this.user=await t.json(),this.team={},this.user.data&&this.user.data.user_id){const s=await i.fetch(`/api/v1/teams/${this.user.data.team_id}`,{method:"GET"});this.team=await s.json()}this.solveCount=this.solves.meta.count,this.failCount=this.fails.meta.count,this.awardCount=this.awards.meta.count,h(this.$refs.scoregraph,c(this.user.data.id,this.user.data.name,this.solves.data,this.awards.data))}});o.data("UserGraphsPublic",e=>k(e));o.start();
