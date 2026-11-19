import { messages } from './messages';
export const currentLanguage=()=>document.documentElement.lang==='en'?'en':'pl';
const dictionary=new Map(messages.map(([pl,en])=>[pl.toLocaleLowerCase('pl'),en]));
const escape=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp('(?<![\\p{L}])(?:'+[...dictionary.keys()].sort((a,b)=>b.length-a.length).map(escape).join('|')+')(?![\\p{L}])','giu');
export function translate(text:string):string {
 if(currentLanguage()==='pl')return text;
 return text.replace(pattern,match=>{if(match==='I')return match;const result=dictionary.get(match.toLocaleLowerCase('pl'))||match;if(match.length>1&&match===match.toUpperCase()&&/[\p{L}]/u.test(match))return result.toUpperCase();return result;}).replace(/(\d),(\d)/g,'$1.$2');
}
// The existing engine owns stable DOM fragments. Localize text nodes and accessible
// labels in place, without replacing controls, handlers, input values or timer state.
export function startLocalization(){
 const root=document.getElementById('root')!;
 const texts=new WeakMap<Text,{source:string;rendered:string}>();
 const attrs=new WeakMap<Element,Map<string,{source:string;rendered:string}>>();
 const names=['aria-label','title','placeholder','aria-valuetext'];
 const localize=(node:Node)=>{
  if(node instanceof Text){if(node.parentElement?.closest('script,style,#appLanguage'))return;const before=texts.get(node);const source=before&&node.data===before.rendered?before.source:node.data;const rendered=translate(source);if(node.data!==rendered)node.data=rendered;texts.set(node,{source,rendered});return;}
  if(node instanceof Element){for(const name of names){const value=node.getAttribute(name);if(value===null)continue;let map=attrs.get(node);if(!map){map=new Map();attrs.set(node,map);}const before=map.get(name);const source=before&&value===before.rendered?before.source:value;const rendered=translate(source);if(value!==rendered)node.setAttribute(name,rendered);map.set(name,{source,rendered});}}
  for(const child of node.childNodes)localize(child);
 };
 const observer=new MutationObserver(records=>{observer.disconnect();for(const record of records){if(record.type==='childList'){for(const child of record.addedNodes)localize(child);}else localize(record.target);}observe();});
 const observe=()=>observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:names});
 const refresh=()=>{observer.disconnect();localize(root);observe();};refresh();window.addEventListener('crema:preferences',refresh);
 return ()=>{observer.disconnect();window.removeEventListener('crema:preferences',refresh);};
}
