import{a as l,b as c}from"./chunk-GB4ZXS3D.js";import{Z as i,aa as a,ga as p,vb as n,xc as r}from"./chunk-ICBN4UWH.js";var s={production:!0,API_AUTH:"https://ecommerce2024-backend-production.up.railway.app/api/auth"};var A=(()=>{class t{constructor(){this.userLoggedSignal=n({_id:"",email:"",emailVerified:!1,img:"",name:"",role:[]}),this.userLoggedComputed=r(()=>this.userLoggedSignal()),this.logoutSignal=n(!1),this.logoutComputed=r(()=>this.logoutSignal()),this.http=p(c)}loginUser(e){let o=new l({"Content-Type":"application/json"}),g={email:e.email,password:e.password};return this.http.post(`${s.API_AUTH}/login`,g,{headers:o}).pipe(i(m=>{localStorage.setItem("token",m.token)}))}loginGoogle(e){return this.http.post(`${s.API_AUTH}/login-google`,{token:e}).pipe(i(o=>{localStorage.setItem("token",o.token)}))}static{this.\u0275fac=function(o){return new(o||t)}}static{this.\u0275prov=a({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();export{A as a};
