var l=void 0,mibbu=function(J,K,A){function q(){for(var c=n.length,e,d,f,g,b,h,a,B,C;c--;)for(e in d=n[c],g=d.d+d.b.A,b=d.d+d.height-d.b.q,h=d.c+d.b.u,d=d.c+d.width-d.b.w,n[c].t)if(f=D[e],a=f.d+f.b.A,B=f.d+f.height-f.b.q,C=f.c+f.b.u,f=f.c+f.width-f.b.w,!(g>B||b<a||h>f||d<C))n[c].t[e]()}function E(){F();for(var c=e.length;c--;)e[c].G();for(c=i.length;c--;)i[c]();if(r){c=+new Date;~~(c-u)>=1E3&&(G=v,v=0,u=c);c="FPS: "+G;if(k)o.fillText(c,4,15);else if(s)s.innerHTML=c;v++}w&&(H=I(E,g))}function L(){g=m.createElement("canvas");o=g.getContext("2d");o.j=o.drawImage;e.sort(function(c,e){return c.h-e.h})}function M(){F=k?function(){o.clearRect(0,0,x,y)}:function(){};r&&(u=new Date);I=function(){return window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(c){setTimeout(c,1E3/60)}}();p=g.style;g.width=x;g.height=y;p.width=x+"px";p.height=y+"px";p.position="absolute";p.overflow="hidden";z.appendChild(g)}var k=!0,j=!1,m=document,e=[],z=A?m.getElementById(A):m.body,g,o,x=J||400,y=K||300,i=[],H,F,u=new Date,r=!1,s,n=[],D=[],I,p,t,h;Array.prototype.j=Array.prototype.indexOf||function(c){for(var e=this.length;e--&&this[e]!==c;);return e};var v=0,G=0,w=!0;m.createElement("canvas").getContext||(k=!1);return{fps:function(){r=!0;return this},init:function(){k?L():(g=m.createElement("div"),r&&(s=m.createElement("div"),g.appendChild(s)));M();return this},on:function(){w=!0;E();if(j)for(var c=e.length;c--;)e[c].k&&(e[c].k.style[h+"AnimationDuration"]=~~(1/(60/e[c].e)*100)/100*(e[c].g+1)+"s");return this},off:function(){clearTimeout(H);w=!1;if(j)for(var c=e.length;c--;)e[c].k&&(e[c].k.style[h+"AnimationDuration"]=0);return this},canvas:function(){return g},ctx:function(){return o},canvasOff:function(){k=!1;typeof z.style.WebkitAnimation!=="undefined"?(t="-webkit-",h="Webkit",j=!0):typeof z.style.MozAnimation!=="undefined"&&(t="-moz-",h="Moz",j=!0);return this},cssAnimationOff:function(){j=!1;return this},hitsOn:function(){i.j(q)===-1&&i.push(q);return this},hitsOff:function(){i.j(q)!==-1&&i.splice(i.j(q),1);return this},spr:function(c,i,d,f,p){function b(){for(var b="@"+t+"keyframes s"+a.id+" {\n",c=100/(a.g+1),e="% { "+t+"transform: translate(",d=0;d<a.g+1;d++)b+=~~(c*d*100)/100+e+a.i*a.width*-1+"px,"+d*a.height*-1+"px); }\n",b+=~~((c*(d+1)-0.01)*100)/100+e+a.i*a.width*-1+"px,"+d*a.height*-1+"px); }\n";return b+("100"+e+a.i*a.width+"px, 0px); }\n}")}var q=k?function(){try{o.j(a.k,a.F*a.i,a.D*a.l,a.F,a.D,a.c,a.d,a.width,a.height)}catch(b){}}:j?function(){}:function(){a.a.top=a.height*a.l*-1+"px";a.a.left=a.width*a.i*-1+"px"},a={};a.id=e.length;a.k=new Image;a.k.src=c;a.e=1;a.width=i;a.F=i;a.height=d;a.D=d;a.g=f;a.H=p;a.I=!1;a.t={};a.l=0;a.i=0;a.e=1;a.p=0;a.c=0;a.d=0;a.h=1;a.s=null;a.r=0;a.B=0;a.b={A:0,u:0,q:0,w:0};if(!k){a.C=m.createElement("div");a.f=a.C.style;a.f.overflow="hidden";a.f.width=i+"px";a.f.height=d+"px";a.f.position="absolute";a.f.zIndex=a.h;a.a=a.k.style;a.a.position="absolute";if(j)a.o=m.createElement("style"),a.o.innerHTML=b(),m.body.appendChild(a.o),a.a[h+"Animation"]="s"+a.id+" "+~~(1/(60/a.e)*100)/100*(a.g+1)+"s linear 0s infinite";a.C.appendChild(a.k);g.appendChild(a.C)}a.id=e.push(a)-1;D.push(a);a.G=function(){if(a.g>0){if(a.p==a.e&&a.e!==0){if(a.l==a.g){if(a.l=0,typeof a.s==="function"&&(a.r++,a.r===a.B))a.s(),a.r=0}else a.l++;a.p=0}a.e!==0&&a.p++;q()}};return{position:function(b,c,d){return b!==l?(a.c=b||a.c,a.d=c||a.d,a.h=d||a.h,k?d&&e.sort(function(a,b){return b.h-a.h}):(a.f.left=b+"px",a.f.top=c+"px",a.f.zIndex=d||a.h),this):{x:a.c,y:a.d,J:a.h}},hit:function(b,c){n.j(a)===-1&&n.push(a);a.t[b.id()]=c;n.j(a)===-1&&n.push(a);return this},zone:function(b,c,d,e){return b!==l?(a.b.u=e,a.b.A=b,a.b.w=c,a.b.q=d,this):a.b},noHits:function(){a.t={};return this},callback:function(b,c){a.s=b;a.B=c;return this},change:function(c,d,e,f,g){a.k.src=c;a.width=d;a.height=e;a.F=d;a.D=e;a.g=f;a.i=g;a.p=0;a.l=0;a.s=null;a.r=0;a.B=0;if(!k&&(a.a.width=d*(a.i+1)+"px",a.a.height=e*(a.g+1)+"px",a.f.width=d+"px",a.f.height=e+"px",j))a.a[h+"AnimationName"]="",a.o.innerHTML=b(),a.a[h+"AnimationName"]="s"+a.id;a.b={A:0,u:0,q:0,w:0};return this},size:function(c,d){if(c!==l){if(!k)a.f.width=c+"px",a.f.height=d+"px",a.a.width=c*(a.H+1)+"px",a.a.height=d*(a.g+1)+"px";a.width=c;a.height=d;if(j)a.a[h+"AnimationName"]="",a.o.innerHTML=b(),a.a[h+"AnimationName"]="s"+a.id;return this}else return{width:a.width,height:a.height}},speed:function(b){return b!==l?(a.e=b,a.p=0,j&&(a.a[h+"AnimationDuration"]=~~(1/(60/b)*100)/100*(a.g+1)+"s"),this):a.e},animation:function(c){if(c!==l){a.i=c;if(j)a.a[h+"AnimationName"]="",a.o.innerHTML=b(),a.a[h+"AnimationName"]="s"+a.id;return this}else return a.i},frame:function(b){return b!==l?(a.l=b,this):a.l},id:function(){return a.id}}},bg:function(c,i,d,f){function h(a){b.m=0;b.n=0;if(typeof a==="string")switch(a){case "N":b.m=0;b.n=-1;break;case "W":b.m=-1;b.n=0;break;case "S":b.m=0;b.n=1;break;case "E":b.m=1,b.n=0}else if(typeof a==="number")a*=j,b.m=Math.cos(a),b.n=Math.sin(a)}var b=this;g.style.backgroundImage="url("+c+")";b.e=i||3;var j=Math.PI/180;h(d);b.h=f.z||0;b.c=f.x||0;b.d=f.y||0;b.id=e.push(b);b.v=0;b.G=function(){b.c+=b.e*b.m*b.v;b.d+=b.e*b.n*b.v;var a=b.c,c=b.d;a.toString().indexOf("e")!=-1&&(a=0);c.toString().indexOf("e")!=-1&&(c=0);g.style.backgroundPosition=a+"px "+c+"px"};return{on:function(){b.v=1;return this},off:function(){b.v=0;return this},dir:function(a){h(a);return this},speed:function(a){return a!==l?(b.e=a,this):b.e},img:function(a){return a!==l?(g.style.backgroundImage="url("+a+")",this):c},position:function(a,c){return a!==l?(b.c=a||b.c,b.d=c||b.d,this):{x:b.c,y:b.d}}}},hook:function(c){i.push(c);return this},unhook:function(c){i.j(c)!==-1&&i.splice(i.j(c),1);return this}}};