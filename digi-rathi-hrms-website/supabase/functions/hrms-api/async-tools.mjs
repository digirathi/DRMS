// Sequential iteration keeps each request's reserved transaction connection ordered.
export async function asyncMap(items,fn){const out=[];for(let i=0;i<items.length;i++)out.push(await fn(items[i],i,items));return out;}
export async function asyncFilter(items,fn){const out=[];for(let i=0;i<items.length;i++)if(await fn(items[i],i,items))out.push(items[i]);return out;}
export async function asyncFind(items,fn){for(let i=0;i<items.length;i++)if(await fn(items[i],i,items))return items[i];}
export async function asyncSome(items,fn){return (await asyncFind(items,fn))!==undefined;}
export async function asyncEvery(items,fn){for(let i=0;i<items.length;i++)if(!await fn(items[i],i,items))return false;return true;}
export async function asyncEach(items,fn){for(let i=0;i<items.length;i++)await fn(items[i],i,items);}
