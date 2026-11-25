window.Csv = (() => {
  function parse(text) {
    const source=String(text||'').replace(/^\uFEFF/,'');
    const firstLine=source.split(/\r?\n/,1)[0]||'';
    const delimiter=countOutsideQuotes(firstLine,';')>countOutsideQuotes(firstLine,',')?';':',';
    const rows=[];
    let row=[],value='',quoted=false;
    for(let i=0;i<source.length;i++){
      const char=source[i];
      if(quoted){
        if(char==='"'&&source[i+1]==='"'){value+='"';i++;}
        else if(char==='"')quoted=false;
        else value+=char;
      }else if(char==='"'&&value==='')quoted=true;
      else if(char===delimiter){row.push(value);value='';}
      else if(char==='\n'||char==='\r'){
        if(char==='\r'&&source[i+1]==='\n')i++;
        row.push(value);value='';
        if(row.some(cell=>cell.trim()!==''))rows.push(row);
        row=[];
      }else value+=char;
    }
    if(value!==''||row.length){row.push(value);if(row.some(cell=>cell.trim()!==''))rows.push(row);}
    if(quoted)throw new Error('El CSV tiene comillas sin cerrar.');
    return rows;
  }
  function countOutsideQuotes(text,needle) {
    let count=0,quoted=false;
    for(let i=0;i<text.length;i++){
      if(text[i]==='"'&&text[i+1]==='"'){i++;continue;}
      if(text[i]==='"')quoted=!quoted;
      else if(!quoted&&text[i]===needle)count++;
    }
    return count;
  }
  function download(rows,filename) {
    const content=rows.map(row=>row.map(cell).join(',')).join('\r\n');
    const blob=new Blob(['\uFEFF',content],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;link.download=filename;
    document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function cell(value) {
    const raw=String(value??'');
    const text=/^[\t\r\n]|^[\t\r\n ]*[=+\-@]/.test(raw)?`'${raw}`:raw;
    return /[",\r\n]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;
  }
  return {parse,download};
})();
