import{d as c,c as f}from"./index.5a84c1a7.js";import{u as p,i as g,a as h,b as x,c as y,d as b,e as v,f as $,g as A,h as j,j as L,k as z,l as I,m as O}from"./echarts.128204f2.js";function T(o){let t=o.concat();for(let e=0;e<o.length;e++)t[e]=o.slice(0,e+1).reduce(function(a,s){return a+s});return t}function w(o,t){let e={title:{left:"center",text:"Top 10 "+(o==="teams"?"Teams":"Users")},tooltip:{trigger:"axis",axisPointer:{type:"cross"}},legend:{type:"scroll",orient:"horizontal",align:"left",bottom:35,data:[]},toolbox:{feature:{dataZoom:{yAxisIndex:"none"},saveAsImage:{}}},grid:{containLabel:!0},xAxis:[{type:"time",boundaryGap:!1,data:[]}],yAxis:[{type:"value"}],dataZoom:[{id:"dataZoomX",type:"slider",xAxisIndex:[0],filterMode:"filter",height:20,top:35,fillerColor:"rgba(233, 236, 241, 0.4)"}],series:[]};const a=Object.keys(t);for(let s=0;s<a.length;s++){const l=[],r=[];for(let n=0;n<t[a[s]].solves.length;n++){l.push(t[a[s]].solves[n].value);const i=c(t[a[s]].solves[n].date);r.push(i.toDate())}const d=T(l);let m=r.map(function(n,i){return[n,d[i]]});e.legend.data.push(t[a[s]].name);const u={name:t[a[s]].name,type:"line",label:{normal:{position:"top"}},itemStyle:{normal:{color:f(t[a[s]].name+t[a[s]].id)}},data:m};e.series.push(u)}return e}p([g,h,x,y,b,v,$,A,j,L,z,I]);function S(o,t){let e=O(o);e.setOption(t),window.addEventListener("resize",()=>{e&&e.resize()})}export{T as c,S as e,w as g};
