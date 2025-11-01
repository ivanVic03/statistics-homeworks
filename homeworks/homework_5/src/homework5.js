function parseNumberList(text){
    if(!text)
        return[];
    return text.split(/[,\s]+/).map(s=>s.trim()).filter(Boolean).map(Number).filter(x=>!Number.isNaN(x));
}

function calcArithmetic(){
    const raw=document.getElementById('arith-input').value;
    const vals=parseNumberList(raw);
    const out=document.getElementById('arith-output');
    if(vals.length===0){
        out.innerHTML='<div class="muted">Please enter at least one valid number.</div>';
        return;
    }
    const sum=vals.reduce((a,b)=>a+b,0);
    const mean=sum/vals.length;out.innerHTML=`<div><strong>Values:</strong> ${vals.join(', ')}</div><div class="muted">Sum = ${sum} | n = ${vals.length}</div><div class="result">Arithmetic mean = ${mean}</div>`;
}

function calcGeometric(){
    const raw=document.getElementById('geom-input').value;
    const vals=parseNumberList(raw).filter(v=>v>0);
    const out=document.getElementById('geom-output');
    if(vals.length===0){
        out.innerHTML='<div class="muted">Please enter at least one positive number.</div>';
        return;
    }
    const logSum=vals.reduce((s,v)=>s+Math.log(v),0);
    const gm=Math.exp(logSum/vals.length);out.innerHTML=`<div><strong>Values:</strong> ${vals.join(', ')}</div><div class="muted">Log-sum = ${logSum.toFixed(4)}</div><div class="result">Geometric mean = ${gm}</div>`;
}

function calcWeighted(){
    const raw=document.getElementById('weighted-input').value;
    if(!raw){
        document.getElementById('weighted-output').innerHTML='<div class="muted">Enter value:weight pairs.</div>';
        return;
    }
    const pairs=raw.split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean);
    const parsed=[];
    for(const p of pairs){
        const parts=p.split(':').map(s=>s.trim());
        if(parts.length!==2)continue;
        const val=Number(parts[0]);
        const w=Number(parts[1]);
        if(Number.isFinite(val)&&Number.isFinite(w))
            parsed.push({val,w});
    }
    const out=document.getElementById('weighted-output');
    if(parsed.length===0){
        out.innerHTML='<div class="muted">Unrecognized format. Use value:weight, e.g. 10:100,40:50</div>';
        return;
    }
    const weightedSum=parsed.reduce((s,p)=>s+p.val*p.w,0);const weights=parsed.reduce((s,p)=>s+p.w,0);
    const wm=weightedSum/weights;out.innerHTML=`<div><strong>Pairs:</strong> ${parsed.map(p=>p.val+':'+p.w).join(', ')}</div><div class="muted">Weighted sum = ${weightedSum} | Sum weights = ${weights}</div><div class="result">Weighted mean = ${wm}</div>`;
}

function downloadExample(){
    const csv='value,weight\n10,100\n40,50\n';const blob=new Blob([csv],{type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download='example_weighted.csv';
    a.click();URL.revokeObjectURL(url);
}