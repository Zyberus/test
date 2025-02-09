"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[955],{622:function(e,t,n){var s=n(2265),r=Symbol.for("react.element"),i=Symbol.for("react.fragment"),o=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c={key:!0,ref:!0,__self:!0,__source:!0};function d(e,t,n){var s,i={},d=null,l=null;for(s in void 0!==n&&(d=""+n),void 0!==t.key&&(d=""+t.key),void 0!==t.ref&&(l=t.ref),t)o.call(t,s)&&!c.hasOwnProperty(s)&&(i[s]=t[s]);if(e&&e.defaultProps)for(s in t=e.defaultProps)void 0===i[s]&&(i[s]=t[s]);return{$$typeof:r,type:e,key:d,ref:l,props:i,_owner:a.current}}t.Fragment=i,t.jsx=d,t.jsxs=d},7437:function(e,t,n){e.exports=n(622)},5654:function(e,t,n){var s,r,i,o,a,c,d,l,E,u,h,f,_,p;n.d(t,{$D:function(){return k}}),(l=s||(s={})).HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",l.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",l.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",l.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",l.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",(E=r||(r={})).HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",E.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",E.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",E.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",E.BLOCK_NONE="BLOCK_NONE",(u=i||(i={})).HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",u.NEGLIGIBLE="NEGLIGIBLE",u.LOW="LOW",u.MEDIUM="MEDIUM",u.HIGH="HIGH",(h=o||(o={})).BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",h.SAFETY="SAFETY",h.OTHER="OTHER",(f=a||(a={})).FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",f.STOP="STOP",f.MAX_TOKENS="MAX_TOKENS",f.SAFETY="SAFETY",f.RECITATION="RECITATION",f.OTHER="OTHER",(_=c||(c={})).TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",_.RETRIEVAL_QUERY="RETRIEVAL_QUERY",_.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",_.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",_.CLASSIFICATION="CLASSIFICATION",_.CLUSTERING="CLUSTERING";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g extends Error{constructor(e){super(`[GoogleGenerativeAI Error]: ${e}`)}}class T extends g{constructor(e,t){super(e),this.response=t}}(p=d||(d={})).GENERATE_CONTENT="generateContent",p.STREAM_GENERATE_CONTENT="streamGenerateContent",p.COUNT_TOKENS="countTokens",p.EMBED_CONTENT="embedContent",p.BATCH_EMBED_CONTENTS="batchEmbedContents";class O{constructor(e,t,n,s){this.model=e,this.task=t,this.apiKey=n,this.stream=s}toString(){let e=`https://generativelanguage.googleapis.com/v1/models/${this.model}:${this.task}`;return this.stream&&(e+="?alt=sse"),e}}async function y(e,t){let n;try{if(!(n=await fetch(e.toString(),{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-client":"genai-js/0.1.3","x-goog-api-key":e.apiKey},body:t})).ok){let e="";try{let t=await n.json();e=t.error.message,t.error.details&&(e+=` ${JSON.stringify(t.error.details)}`)}catch(e){}throw Error(`[${n.status} ${n.statusText}] ${e}`)}}catch(n){let t=new g(`Error fetching from ${e.toString()}: ${n.message}`);throw t.stack=n.stack,t}return n}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function S(e){return e.text=()=>{if(e.candidates&&e.candidates.length>0){var t,n,s,r;if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),C(e.candidates[0]))throw new T(`${N(e)}`,e);return(null===(r=null===(s=null===(n=null===(t=e.candidates)||void 0===t?void 0:t[0].content)||void 0===n?void 0:n.parts)||void 0===s?void 0:s[0])||void 0===r?void 0:r.text)?e.candidates[0].content.parts[0].text:""}if(e.promptFeedback)throw new T(`Text not available. ${N(e)}`,e);return""},e}let m=[a.RECITATION,a.SAFETY];function C(e){return!!e.finishReason&&m.includes(e.finishReason)}function N(e){var t,n,s;let r="";if((!e.candidates||0===e.candidates.length)&&e.promptFeedback)r+="Response was blocked",(null===(t=e.promptFeedback)||void 0===t?void 0:t.blockReason)&&(r+=` due to ${e.promptFeedback.blockReason}`),(null===(n=e.promptFeedback)||void 0===n?void 0:n.blockReasonMessage)&&(r+=`: ${e.promptFeedback.blockReasonMessage}`);else if(null===(s=e.candidates)||void 0===s?void 0:s[0]){let t=e.candidates[0];C(t)&&(r+=`Candidate was blocked due to ${t.finishReason}`,t.finishMessage&&(r+=`: ${t.finishMessage}`))}return r}function R(e){return this instanceof R?(this.v=e,this):new R(e)}"function"==typeof SuppressedError&&SuppressedError;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let A=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function I(e){let t=[],n=e.getReader();for(;;){let{done:e,value:s}=await n.read();if(e)return S(function(e){let t=e[e.length-1],n={promptFeedback:null==t?void 0:t.promptFeedback};for(let t of e)if(t.candidates)for(let e of t.candidates){let t=e.index;if(n.candidates||(n.candidates=[]),n.candidates[t]||(n.candidates[t]={index:e.index}),n.candidates[t].citationMetadata=e.citationMetadata,n.candidates[t].finishReason=e.finishReason,n.candidates[t].finishMessage=e.finishMessage,n.candidates[t].safetyRatings=e.safetyRatings,e.content&&e.content.parts)for(let s of(n.candidates[t].content||(n.candidates[t].content={role:e.content.role||"user",parts:[{text:""}]}),e.content.parts))s.text&&(n.candidates[t].content.parts[0].text+=s.text)}return n}(t));t.push(s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function v(e,t,n){let s=new O(t,d.STREAM_GENERATE_CONTENT,e,!0);return function(e){let[t,n]=(function(e){let t=e.getReader();return new ReadableStream({start(e){let n="";return function s(){return t.read().then(({value:t,done:r})=>{let i;if(r){if(n.trim()){e.error(new g("Failed to parse stream"));return}e.close();return}let o=(n+=t).match(A);for(;o;){try{i=JSON.parse(o[1])}catch(t){e.error(new g(`Error parsing JSON response: "${o[1]}"`));return}e.enqueue(i),o=(n=n.substring(o[0].length)).match(A)}return s()})}()}})})(e.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0}))).tee();return{stream:function(e){return function(e,t,n){if(!Symbol.asyncIterator)throw TypeError("Symbol.asyncIterator is not defined.");var s,r=n.apply(e,t||[]),i=[];return s={},o("next"),o("throw"),o("return"),s[Symbol.asyncIterator]=function(){return this},s;function o(e){r[e]&&(s[e]=function(t){return new Promise(function(n,s){i.push([e,t,n,s])>1||a(e,t)})})}function a(e,t){try{var n;(n=r[e](t)).value instanceof R?Promise.resolve(n.value.v).then(c,d):l(i[0][2],n)}catch(e){l(i[0][3],e)}}function c(e){a("next",e)}function d(e){a("throw",e)}function l(e,t){e(t),i.shift(),i.length&&a(i[0][0],i[0][1])}}(this,arguments,function*(){let t=e.getReader();for(;;){let{value:e,done:n}=yield R(t.read());if(n)break;yield yield R(S(e))}})}(t),response:I(n)}}(await y(s,JSON.stringify(n)))}async function M(e,t,n){let s=new O(t,d.GENERATE_CONTENT,e,!1),r=await y(s,JSON.stringify(n));return{response:S(await r.json())}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function w(e,t){let n=[];if("string"==typeof e)n=[{text:e}];else for(let t of e)"string"==typeof t?n.push({text:t}):n.push(t);return{role:t,parts:n}}function L(e){return e.contents?e:{contents:[w(e,"user")]}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let b="SILENT_ERROR";class H{constructor(e,t,n){this.model=t,this.params=n,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=e,(null==n?void 0:n.history)&&(this._history=n.history.map(e=>{if(!e.role)throw Error("Missing role for history item: "+JSON.stringify(e));return w(e.parts,e.role)}))}async getHistory(){return await this._sendPromise,this._history}async sendMessage(e){var t,n;let s;await this._sendPromise;let r=w(e,"user"),i={safetySettings:null===(t=this.params)||void 0===t?void 0:t.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,contents:[...this._history,r]};return this._sendPromise=this._sendPromise.then(()=>M(this._apiKey,this.model,i)).then(e=>{var t;if(e.response.candidates&&e.response.candidates.length>0){this._history.push(r);let n=Object.assign({parts:[],role:"model"},null===(t=e.response.candidates)||void 0===t?void 0:t[0].content);this._history.push(n)}else{let t=N(e.response);t&&console.warn(`sendMessage() was unsuccessful. ${t}. Inspect response object for details.`)}s=e}),await this._sendPromise,s}async sendMessageStream(e){var t,n;await this._sendPromise;let s=w(e,"user"),r={safetySettings:null===(t=this.params)||void 0===t?void 0:t.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,contents:[...this._history,s]},i=v(this._apiKey,this.model,r);return this._sendPromise=this._sendPromise.then(()=>i).catch(e=>{throw Error(b)}).then(e=>e.response).then(e=>{if(e.candidates&&e.candidates.length>0){this._history.push(s);let t=Object.assign({},e.candidates[0].content);t.role||(t.role="model"),this._history.push(t)}else{let t=N(e);t&&console.warn(`sendMessageStream() was unsuccessful. ${t}. Inspect response object for details.`)}}).catch(e=>{e.message!==b&&console.error(e)}),i}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function P(e,t,n){let s=new O(t,d.COUNT_TOKENS,e,!1);return(await y(s,JSON.stringify(Object.assign(Object.assign({},n),{model:t})))).json()}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function D(e,t,n){let s=new O(t,d.EMBED_CONTENT,e,!1);return(await y(s,JSON.stringify(n))).json()}async function F(e,t,n){let s=new O(t,d.BATCH_EMBED_CONTENTS,e,!1),r=n.requests.map(e=>Object.assign(Object.assign({},e),{model:`models/${t}`}));return(await y(s,JSON.stringify({requests:r}))).json()}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K{constructor(e,t){var n;this.apiKey=e,t.model.startsWith("models/")?this.model=null===(n=t.model.split("models/"))||void 0===n?void 0:n[1]:this.model=t.model,this.generationConfig=t.generationConfig||{},this.safetySettings=t.safetySettings||[]}async generateContent(e){let t=L(e);return M(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings},t))}async generateContentStream(e){let t=L(e);return v(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings},t))}startChat(e){return new H(this.apiKey,this.model,e)}async countTokens(e){let t=L(e);return P(this.apiKey,this.model,t)}async embedContent(e){let t="string"==typeof e||Array.isArray(e)?{content:w(e,"user")}:e;return D(this.apiKey,this.model,t)}async batchEmbedContents(e){return F(this.apiKey,this.model,e)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k{constructor(e){this.apiKey=e}getGenerativeModel(e){if(!e.model)throw new g("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new K(this.apiKey,e)}}}}]);