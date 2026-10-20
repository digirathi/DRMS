/* ISO values remain in records/forms; every displayed full date is DD/MM/YYYY. */
(() => {
  const months={jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'};
  window.displayDate=HRDomain.date;
  function textDates(s){return s.replace(/\b(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?Z?)?\b/g,(all,y,m,d,t)=>`${d}/${m}/${y}${t?' '+t:''}`).replace(/\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{4})\b/gi,(all,d,m,y)=>`${d.padStart(2,'0')}/${months[m.slice(0,3).toLowerCase()]}/${y}`);}
  window.standardizeDates=function(root=document.body){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
    while(node=walker.nextNode()){if(node.parentElement?.closest('script,style,textarea,input,[contenteditable]'))continue;const next=textDates(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;}
    root.querySelectorAll('input[type="date"]:not([data-date-iso])').forEach(input=>{
      input.dataset.dateIso='true';const display=document.createElement('input');display.type='text';display.inputMode='numeric';display.placeholder='DD/MM/YYYY';display.className=input.className;display.style.cssText=input.style.cssText;
      display.value=input.value?HRDomain.date(input.value):'';display.required=input.required;display.disabled=input.disabled;display.readOnly=input.readOnly;display.maxLength=10;
      display.setAttribute('aria-label',(input.getAttribute('aria-label')||input.labels?.[0]?.textContent?.trim()||input.name||'Date')+' (DD/MM/YYYY)');
      input.type='hidden';input.after(display);
      function sync(commit){const iso=HRDomain.isoDate(display.value);let error='';if(display.value&&!iso)error='Enter a valid date as DD/MM/YYYY.';else if(iso&&input.min&&iso<input.min)error='Choose '+HRDomain.date(input.min)+' or later.';else if(iso&&input.max&&iso>input.max)error='Choose '+HRDomain.date(input.max)+' or earlier.';display.setCustomValidity(error);input.value=error?'':iso;if(commit&&!error){input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));}}
      display.addEventListener('input',()=>sync(false));display.addEventListener('change',()=>sync(true));
    });
  };
  let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;standardizeDates();});}).observe(document.body,{childList:true,subtree:true,characterData:true});
  standardizeDates();
})();
