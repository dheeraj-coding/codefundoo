(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{5434:function(e,t,a){e.exports=a(5628)},5439:function(e,t,a){},5628:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),l=a(21),r=a.n(l),o=(a(5439),a(22)),s=a(23),c=a(25),d=a(24),u=a(26),h=a(17),m=a(4),p=a(18),b=a(5633),g=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).handlClick=a.handlClick.bind(Object(h.a)(Object(h.a)(a))),a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"handlClick",value:function(e){var t=this;return function(a){t.props.history.push("/"+e)}}},{key:"render",value:function(){var e=this.props.classes;return i.a.createElement("div",null,i.a.createElement(m.a,{position:"static"},i.a.createElement(m.p,null,i.a.createElement(m.q,{variant:"headline",className:e.grow},"Torrid"),i.a.createElement(m.b,{color:"inherit",onClick:this.handlClick("dashboard")},"Dashboard"),i.a.createElement(m.b,{color:"inherit",onClick:this.handlClick("affected")},"Affected Regions"),i.a.createElement(m.b,{color:"inherit",onClick:this.handlClick("login")},"Login"),i.a.createElement(m.b,{color:"inherit",onClick:this.handlClick("register")},"Register"))))}}]),t}(n.Component),v=Object(b.a)(Object(p.withStyles)(function(e){return{grow:{flexGrow:1}}})(g)),E=a(5632),O=a(5629),f=a(5631),j=a(19),y=a(148),w="fdb2f898fa5c4e",k=a.n(y).a.initializeApp({apiKey:"AIzaSyCPXvYYr8GTVdI-QoYr95w38svHv1kkVOU",authDomain:"codefundoo-1539958868140.firebaseapp.com",databaseURL:"https://codefundoo-1539958868140.firebaseio.com",projectId:"codefundoo-1539958868140",storageBucket:"codefundoo-1539958868140.appspot.com",messagingSenderId:"980353695873"}),C=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).state={dialogContent:"",dialogTitle:"",dialogOpen:!1,disableLogin:!1},a.handleLogin=a.handleLogin.bind(Object(h.a)(Object(h.a)(a))),a.handleDialogClose=a.handleDialogClose.bind(Object(h.a)(Object(h.a)(a))),a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"handleLogin",value:function(e){var t=this,a=document.getElementById("username").value,n=document.getElementById("password").value;this.setState({disableLogin:!0}),k.auth().signInWithEmailAndPassword(a,n).then(function(e){t.props.history.push("/dashboard")}).catch(function(e){t.setState({dialogOpen:!0,dialogContent:"Invalid Username or Password",dialogTitle:"Login Failed",disableLogin:!1})})}},{key:"handleDialogClose",value:function(e){this.setState({dialogOpen:!1})}},{key:"render",value:function(){var e=this.props.classes;return i.a.createElement("div",null,i.a.createElement(m.h,{className:e.paper,elevation:3},i.a.createElement(m.q,{style:{textAlign:"center"},variant:"display3"},"Login"),i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement(m.o,{className:e.textField,required:!0,id:"username",label:"Email"}),i.a.createElement("br",null),i.a.createElement(m.o,{className:e.textField,required:!0,id:"password",type:"password",label:"Password"}),i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement(m.b,{variant:"contained",color:"primary",onClick:this.handleLogin,disabled:this.state.disableLogin},"Login")),i.a.createElement(m.c,{open:this.state.dialogOpen,onClose:this.handleDialogClose},i.a.createElement(m.f,null,this.state.dialogTitle),i.a.createElement(m.d,null,i.a.createElement(m.e,null,this.state.dialogContent))))}}]),t}(n.Component),S=Object(p.withStyles)(function(e){var t;return{paper:(t={},Object(j.a)(t,e.breakpoints.up("md"),{width:"20vw",height:"60vh",margin:"2em auto"}),Object(j.a)(t,"height","60vh"),Object(j.a)(t,"margin","2em"),Object(j.a)(t,"padding","1em"),Object(j.a)(t,"boxSizing","border-box"),Object(j.a)(t,"textAlign","center"),t),textField:{width:"80%",margin:"1em auto"}}})(C),x=a(37),D=a(68),T=a.n(D);function I(e,t,a){T()({url:"https://eu1.locationiq.com/v1/reverse.php?key="+w+"&lat="+e+"&lon="+t+"&format=json",method:"GET"}).then(function(e){a(e.data.address.postcode)})}var R=a(69),q=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).state={},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this;return i.a.createElement("div",{style:{width:"100%",height:"100%"}},i.a.createElement(R.Map,{google:this.props.google,zoom:8,style:{width:"100%",height:"100%"},initialCenter:this.props.position[0]},this.props.position.map(function(t,a){return i.a.createElement(R.Marker,{name:e.props.name[a],title:e.props.title[a],position:t,key:a})})))}}]),t}(n.Component),A=Object(R.GoogleApiWrapper)({apiKey:"AIzaSyBB9vokxe7r-4m8uGRmSDkQTBHsh_9E22s"})(q),L=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).state={locations:{}},a.dbRef={},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this;this.props.coords&&I(this.props.coords.latitude,this.props.coords.longitude,function(t){e.dbRef=k.database().ref("locations/"),e.dbRef.on("value",function(t){e.setState(function(){return{locations:t.val()}})})});var t=this.props.classes;return i.a.createElement("div",null,i.a.createElement(m.h,{className:t.paper,elevation:3},Object.keys(this.state.locations).length?i.a.createElement(A,{name:Object.keys(this.state.locations).map(function(t){return e.state.locations[t].display_name}),title:Object.keys(this.state.locations).map(function(t){return e.state.locations[t].display_name}),position:Object.keys(this.state.locations).map(function(t){return{lat:e.state.locations[t].lat,lng:e.state.locations[t].lon}})}):void 0))}}]),t}(n.Component),N=Object(x.geolocated)({positionOptions:{enableHighAccuracy:!1},userDecisionTimeout:1})(Object(p.withStyles)(function(e){return{paper:{width:"80%",height:"80%",margin:"1em"}}})(L)),U=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).state={username:"",password:"",errorText:"",errorState:!1,dialogContent:"",dialogTitle:"",dialogOpen:!1,registerDisable:!1},a.handleRegister=a.handleRegister.bind(Object(h.a)(Object(h.a)(a))),a.handleDialogClose=a.handleDialogClose.bind(Object(h.a)(Object(h.a)(a))),a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"handleRegister",value:function(e){var t=this,a=document.getElementById("username").value,n=document.getElementById("password").value,i=document.getElementById("repeatpassword").value;n===i&&n.length>=6&&this.props.isGeolocationEnabled?(this.setState({username:a,password:n,errorState:!1,errorText:"",registerDisable:!0}),k.auth().createUserWithEmailAndPassword(a,n).then(function(e){T()({method:"POST",url:"http://localhost:8080/hospitals",data:{name:a,password:n,repeat:i,lat:t.props.coords.latitude,lon:t.props.coords.longitude},crossDomain:!0}).then(function(e){t.props.history.push("/login")},function(e){t.setState({dialogOpen:!0,dialogContent:"Sorry! Our servers are facing issues please try again in sometime.",dialogTitle:"Registration Failed",registerDisable:!1})})}).catch(function(e){t.setState({dialogOpen:!0,dialogContent:"Sorry! Our servers are facing issues please try again in sometime.",dialogTitle:"Registration Failed",registerDisable:!1})})):this.props.isGeolocationEnabled?n.length<6?this.setState({errorText:"Minimum Password length is 6 characters",errorState:!0}):this.setState({errorText:"Passwords don't match",errorState:!0}):this.setState({errorText:"Geolocation must be enabled",errorState:!0})}},{key:"handleDialogClose",value:function(e){this.setState({dialogOpen:!1})}},{key:"render",value:function(){var e=this.props.classes;return i.a.createElement("div",null,i.a.createElement(m.h,{className:e.paper,elevation:3},i.a.createElement(m.q,{variant:"display3"},"Register"),i.a.createElement("br",null),i.a.createElement(m.o,{required:!0,className:e.textField,id:"username",label:"Email"}),i.a.createElement(m.o,{required:!0,className:e.textField,id:"password",label:"Password",type:"password"}),i.a.createElement(m.o,{required:!0,className:e.textField,id:"repeatpassword",label:"Re-type Password",type:"password"}),i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement(m.b,{variant:"contained",color:"primary",onClick:this.handleRegister,disabled:this.state.registerDisable},"Register"),i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement(m.q,{variant:"body2",color:"error"},this.state.errorText)),i.a.createElement(m.c,{open:this.state.dialogOpen,onClose:this.handleDialogClose},i.a.createElement(m.f,null,this.state.dialogTitle),i.a.createElement(m.d,null,i.a.createElement(m.e,null,this.state.dialogContent))))}}]),t}(n.Component),B=Object(b.a)(Object(x.geolocated)({positionOptions:{enableHighAccuracy:!1},userDecisionTimeout:1})(Object(p.withStyles)(function(e){var t;return{paper:(t={},Object(j.a)(t,e.breakpoints.up("md"),{width:"20vw",height:"60vh",margin:"2em auto"}),Object(j.a)(t,"height","60vh"),Object(j.a)(t,"margin","2em"),Object(j.a)(t,"padding","1em"),Object(j.a)(t,"boxSizing","border-box"),Object(j.a)(t,"textAlign","center"),t),textField:{width:"80%",margin:"1em auto"}}})(U))),P=a(64),F=a.n(P),z=a(149);function G(e){return i.a.createElement(m.i,Object.assign({direction:"up"},e))}var H=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).state={users:{},activeUser:{},open:!1},a.dbRef={},a.handleClose=a.handleClose.bind(Object(h.a)(Object(h.a)(a))),a.handleOpen=a.handleOpen.bind(Object(h.a)(Object(h.a)(a))),a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"handleOpen",value:function(e,t){this.setState({open:!0,activeUser:e})}},{key:"handleClose",value:function(e){this.setState({open:!1})}},{key:"render",value:function(){var e=this,t=this.props.classes;return this.props.coords&&I(this.props.coords.latitude,this.props.coords.longitude,function(t){e.dbRef=k.database().ref("locations/"+t+"/affected"),e.dbRef.on("value",function(t){e.setState({users:t.val()})})}),i.a.createElement("div",null,i.a.createElement(m.h,{className:t.paper,elevation:3},i.a.createElement(m.j,null,i.a.createElement(m.m,null,i.a.createElement(m.n,null,i.a.createElement(m.l,null,i.a.createElement(m.q,{variant:"title"},"Name")),i.a.createElement(m.l,null,i.a.createElement(m.q,{variant:"title"},"Phone Number")),i.a.createElement(m.l,null,i.a.createElement(m.q,{variant:"title"},"View")))),i.a.createElement(m.k,null,this.state.users?Object.keys(this.state.users).map(function(t,a){return i.a.createElement(m.n,{key:t+a},i.a.createElement(m.l,null,i.a.createElement(m.q,null,e.state.users[t].name)),i.a.createElement(m.l,null,i.a.createElement(m.q,null,e.state.users[t].phone)),i.a.createElement(m.l,null,i.a.createElement(m.g,{onClick:e.handleOpen.bind(e,e.state.users[t])},i.a.createElement(z.a,{fontSize:"small"}))))}):void 0))),i.a.createElement(m.c,{fullScreen:!0,open:this.state.open,onClose:this.handleClose,TransitionComponent:G},i.a.createElement(m.a,{className:t.appBar},i.a.createElement(m.p,null,i.a.createElement(m.g,{color:"inherit",onClick:this.handleClose,"aria-label":"Close"},i.a.createElement(F.a,null)),i.a.createElement(m.q,{variant:"h6",color:"inherit",className:t.flex},"Location"))),i.a.createElement(A,{name:[this.state.activeUser.name],title:[this.state.activeUser.name+":"+this.state.activeUser.phone],position:[{lat:this.state.activeUser.lat,lng:this.state.activeUser.lon}]})))}}]),t}(n.Component),W=Object(x.geolocated)({positionOptions:{enableHighAccuracy:!1},userDecisionTimeout:1})(Object(p.withStyles)(function(e){var t;return{paper:(t={},Object(j.a)(t,e.breakpoints.up("md"),{width:"90vw",margin:"2em auto"}),Object(j.a)(t,"width","100vw"),Object(j.a)(t,"margin","1em"),Object(j.a)(t,"height","600"),t),appBar:{position:"relative"},flex:{flex:1}}})(H)),M=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).state={loginState:window.localStorage.getItem("loggedIn"),email:window.localStorage.getItem("UID")},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;k.auth().onAuthStateChanged(function(t){t&&e.setState({loginState:!0,email:t.email})})}},{key:"render",value:function(){var e=this;return i.a.createElement("div",{className:"App"},i.a.createElement(v,null),i.a.createElement("main",null,i.a.createElement(E.a,null,i.a.createElement(O.a,{path:"/login",component:S}),i.a.createElement(O.a,{path:"/register",component:B}),i.a.createElement(O.a,{path:"/dashboard",render:function(t){return e.state.loginState?i.a.createElement(W,Object.assign({},t,{username:e.state.email})):i.a.createElement(f.a,{to:"/login"})}}),i.a.createElement(O.a,{path:"/affected",component:N})),i.a.createElement("div",{style:{margin:"20vh auto",textAlign:"center"}},i.a.createElement(m.q,{variant:"display3"},"Join Us, Save Lives"),i.a.createElement("br",null),i.a.createElement(m.b,{color:"primary",onClick:function(t){e.props.history.push("/register")},variant:"outlined",size:"large"},"Register"))))}}]),t}(n.Component),J=a(5630);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));k.auth().onAuthStateChanged(function(e){e&&(window.localStorage.setItem("UID",e.email),window.localStorage.setItem("loggedIn",!0))}),r.a.render(i.a.createElement(J.a,null,i.a.createElement(M,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[5434,2,1]]]);
//# sourceMappingURL=main.c4ce582d.chunk.js.map