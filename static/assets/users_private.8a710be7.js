import{m as o,c as n,C as e}from"./index.5a84c1a7.js";import{g as l}from"./userscore.183e251d.js";import{e as u}from"./index.4d677054.js";import"./echarts.128204f2.js";window.Alpine=o;o.data("UserGraphs",()=>({solves:null,fails:null,awards:null,solveCount:0,failCount:0,awardCount:0,getSolvePercentage(){return(this.solveCount/(this.solveCount+this.failCount)*100).toFixed(2)},getFailPercentage(){return(this.failCount/(this.solveCount+this.failCount)*100).toFixed(2)},getCategoryBreakdown(){const a=[],t={};this.solves.data.map(s=>{a.push(s.challenge.category)}),a.forEach(s=>{s in t?t[s]+=1:t[s]=1});const i=[];for(const s in t){const r=Number(t[s]/a.length*100).toFixed(2);i.push({name:s,count:t[s],color:n(s),percent:r})}return i},async init(){this.solves=await e.pages.users.userSolves("me"),this.fails=await e.pages.users.userFails("me"),this.awards=await e.pages.users.userAwards("me"),this.solveCount=this.solves.meta.count,this.failCount=this.fails.meta.count,this.awardCount=this.awards.meta.count,u(this.$refs.scoregraph,l(e.user.id,e.user.name,this.solves.data,this.awards.data))}}));o.start();
