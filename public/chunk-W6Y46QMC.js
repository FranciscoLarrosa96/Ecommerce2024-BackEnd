import{a as d}from"./chunk-DBZEKNE6.js";import{b as c}from"./chunk-RNY6XY7Q.js";import{H as u,r as p,u as s}from"./chunk-GB4ZXS3D.js";import{n as a}from"./chunk-NPFQKEBV.js";import{Kb as i,Lb as n,Tb as l,ec as r,ga as o,kb as m}from"./chunk-ICBN4UWH.js";var I=(()=>{class t{constructor(){this._router=o(c),this._authSvc=o(d)}ngOnInit(){google.accounts.id.initialize({client_id:"684557034764-dot47pevhl29b9q3koj83vnkkim2v26l.apps.googleusercontent.com"})}logout(){google.accounts.id.revoke(this._authSvc.userLoggedComputed().email,()=>{localStorage.removeItem("token")}),this._router.navigate(["/home"])}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=m({type:t,selectors:[["app-profile"]],decls:4,vars:0,consts:[["mat-fab","","extended","",3,"click"]],template:function(e,g){e&1&&(i(0,"button",0),l("click",function(){return g.logout()}),i(1,"mat-icon"),r(2,"logout"),n(),r(3," Logout "),n())},dependencies:[a,u,p,s],encapsulation:2})}}return t})();export{I as ProfileComponent};
