/*! For license information please see 153.d1c2e3d7.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[153],{5909:(e,t)=>{var r=Symbol.for("react.element"),n=Symbol.for("react.portal"),u=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),c=Symbol.for("react.provider"),s=Symbol.for("react.context"),i=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),l=Symbol.for("react.memo"),p=Symbol.for("react.lazy"),d=Symbol.iterator;var y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},h=Object.assign,b={};function m(e,t,r){this.props=e,this.context=t,this.refs=b,this.updater=r||y}function _(){}function v(e,t,r){this.props=e,this.context=t,this.refs=b,this.updater=r||y}m.prototype.isReactComponent={},m.prototype.setState=function(e,t){if("object"!==typeof e&&"function"!==typeof e&&null!=e)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},m.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},_.prototype=m.prototype;var S=v.prototype=new _;S.constructor=v,h(S,m.prototype),S.isPureReactComponent=!0;var w=Array.isArray,E=Object.prototype.hasOwnProperty,g={current:null},k={key:!0,ref:!0,__self:!0,__source:!0};function R(e,t,n){var u,o={},a=null,c=null;if(null!=t)for(u in void 0!==t.ref&&(c=t.ref),void 0!==t.key&&(a=""+t.key),t)E.call(t,u)&&!k.hasOwnProperty(u)&&(o[u]=t[u]);var s=arguments.length-2;if(1===s)o.children=n;else if(1<s){for(var i=Array(s),f=0;f<s;f++)i[f]=arguments[f+2];o.children=i}if(e&&e.defaultProps)for(u in s=e.defaultProps)void 0===o[u]&&(o[u]=s[u]);return{$$typeof:r,type:e,key:a,ref:c,props:o,_owner:g.current}}function C(e){return"object"===typeof e&&null!==e&&e.$$typeof===r}var $=/\/+/g;function j(e,t){return"object"===typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,(function(e){return t[e]}))}(""+e.key):t.toString(36)}function O(e,t,u,o,a){var c=typeof e;"undefined"!==c&&"boolean"!==c||(e=null);var s=!1;if(null===e)s=!0;else switch(c){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case r:case n:s=!0}}if(s)return a=a(s=e),e=""===o?"."+j(s,0):o,w(a)?(u="",null!=e&&(u=e.replace($,"$&/")+"/"),O(a,t,u,"",(function(e){return e}))):null!=a&&(C(a)&&(a=function(e,t){return{$$typeof:r,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(a,u+(!a.key||s&&s.key===a.key?"":(""+a.key).replace($,"$&/")+"/")+e)),t.push(a)),1;if(s=0,o=""===o?".":o+":",w(e))for(var i=0;i<e.length;i++){var f=o+j(c=e[i],i);s+=O(c,t,u,f,a)}else if(f=function(e){return null===e||"object"!==typeof e?null:"function"===typeof(e=d&&e[d]||e["@@iterator"])?e:null}(e),"function"===typeof f)for(e=f.call(e),i=0;!(c=e.next()).done;)s+=O(c=c.value,t,u,f=o+j(c,i++),a);else if("object"===c)throw t=String(e),Error("Objects are not valid as a React child (found: "+("[object Object]"===t?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function x(e,t,r){if(null==e)return e;var n=[],u=0;return O(e,n,"","",(function(e){return t.call(r,e,u++)})),n}function A(e){if(-1===e._status){var t=e._result;(t=t()).then((function(t){0!==e._status&&-1!==e._status||(e._status=1,e._result=t)}),(function(t){0!==e._status&&-1!==e._status||(e._status=2,e._result=t)})),-1===e._status&&(e._status=0,e._result=t)}if(1===e._status)return e._result.default;throw e._result}var I={current:null},P={transition:null},T={ReactCurrentDispatcher:I,ReactCurrentBatchConfig:P,ReactCurrentOwner:g};function V(){throw Error("act(...) is not supported in production builds of React.")}t.Children={map:x,forEach:function(e,t,r){x(e,(function(){t.apply(this,arguments)}),r)},count:function(e){var t=0;return x(e,(function(){t++})),t},toArray:function(e){return x(e,(function(e){return e}))||[]},only:function(e){if(!C(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},t.Component=m,t.Fragment=u,t.Profiler=a,t.PureComponent=v,t.StrictMode=o,t.Suspense=f,t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=T,t.act=V,t.cloneElement=function(e,t,n){if(null===e||void 0===e)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var u=h({},e.props),o=e.key,a=e.ref,c=e._owner;if(null!=t){if(void 0!==t.ref&&(a=t.ref,c=g.current),void 0!==t.key&&(o=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(i in t)E.call(t,i)&&!k.hasOwnProperty(i)&&(u[i]=void 0===t[i]&&void 0!==s?s[i]:t[i])}var i=arguments.length-2;if(1===i)u.children=n;else if(1<i){s=Array(i);for(var f=0;f<i;f++)s[f]=arguments[f+2];u.children=s}return{$$typeof:r,type:e.type,key:o,ref:a,props:u,_owner:c}},t.createContext=function(e){return(e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null}).Provider={$$typeof:c,_context:e},e.Consumer=e},t.createElement=R,t.createFactory=function(e){var t=R.bind(null,e);return t.type=e,t},t.createRef=function(){return{current:null}},t.forwardRef=function(e){return{$$typeof:i,render:e}},t.isValidElement=C,t.lazy=function(e){return{$$typeof:p,_payload:{_status:-1,_result:e},_init:A}},t.memo=function(e,t){return{$$typeof:l,type:e,compare:void 0===t?null:t}},t.startTransition=function(e){var t=P.transition;P.transition={};try{e()}finally{P.transition=t}},t.unstable_act=V,t.useCallback=function(e,t){return I.current.useCallback(e,t)},t.useContext=function(e){return I.current.useContext(e)},t.useDebugValue=function(){},t.useDeferredValue=function(e){return I.current.useDeferredValue(e)},t.useEffect=function(e,t){return I.current.useEffect(e,t)},t.useId=function(){return I.current.useId()},t.useImperativeHandle=function(e,t,r){return I.current.useImperativeHandle(e,t,r)},t.useInsertionEffect=function(e,t){return I.current.useInsertionEffect(e,t)},t.useLayoutEffect=function(e,t){return I.current.useLayoutEffect(e,t)},t.useMemo=function(e,t){return I.current.useMemo(e,t)},t.useReducer=function(e,t,r){return I.current.useReducer(e,t,r)},t.useRef=function(e){return I.current.useRef(e)},t.useState=function(e){return I.current.useState(e)},t.useSyncExternalStore=function(e,t,r){return I.current.useSyncExternalStore(e,t,r)},t.useTransition=function(){return I.current.useTransition()},t.version="18.3.1"},8554:(e,t,r)=>{e.exports=r(5909)},153:(e,t,r)=>{r.d(t,{Line:()=>b});var n=r(45),u=r(9379),o=r(8554),a=r(5297);const c=["height","width","redraw","datasetIdKey","type","data","options","plugins","fallbackContent","updateMode"],s="label";function i(e,t){"function"===typeof e?e(t):e&&(e.current=t)}function f(e,t){e.labels=t}function l(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:s;const n=[];e.datasets=t.map((t=>{const o=e.datasets.find((e=>e[r]===t[r]));return o&&t.data&&!n.includes(o)?(n.push(o),Object.assign(o,t),o):(0,u.A)({},t)}))}function p(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:s;const r={labels:[],datasets:[]};return f(r,e.labels),l(r,e.datasets,t),r}function d(e,t){const{height:r=150,width:s=300,redraw:d=!1,datasetIdKey:y,type:h,data:b,options:m,plugins:_=[],fallbackContent:v,updateMode:S}=e,w=(0,n.A)(e,c),E=(0,o.useRef)(null),g=(0,o.useRef)(null),k=()=>{E.current&&(g.current=new a.Chart(E.current,{type:h,data:p(b,y),options:m&&(0,u.A)({},m),plugins:_}),i(t,g.current))},R=()=>{i(t,null),g.current&&(g.current.destroy(),g.current=null)};return(0,o.useEffect)((()=>{!d&&g.current&&m&&function(e,t){const r=e.options;r&&t&&Object.assign(r,t)}(g.current,m)}),[d,m]),(0,o.useEffect)((()=>{!d&&g.current&&f(g.current.config.data,b.labels)}),[d,b.labels]),(0,o.useEffect)((()=>{!d&&g.current&&b.datasets&&l(g.current.config.data,b.datasets,y)}),[d,b.datasets]),(0,o.useEffect)((()=>{g.current&&(d?(R(),setTimeout(k)):g.current.update(S))}),[d,m,b.labels,b.datasets,S]),(0,o.useEffect)((()=>{g.current&&(R(),setTimeout(k))}),[h]),(0,o.useEffect)((()=>(k(),()=>R())),[]),o.createElement("canvas",(0,u.A)({ref:E,role:"img",height:r,width:s},w),v)}const y=(0,o.forwardRef)(d);function h(e,t){return a.Chart.register(t),(0,o.forwardRef)(((t,r)=>o.createElement(y,(0,u.A)((0,u.A)({},t),{},{ref:r,type:e}))))}const b=h("line",a.ZT)}}]);