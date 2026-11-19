(function(){
var S=window.SHOP,P=[],cart={},cat="All",$=function(i){return document.getElementById(i)};
try{cart=JSON.parse(localStorage.getItem("dd-cart")||"{}")}catch(e){}
function tk(n){return "৳"+Number(n).toLocaleString("en-IN")}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function pic(x){return x.image?'<img src="'+esc(x.image)+'" alt="'+esc(x.name)+'" loading="lazy">':esc(x.emoji||"📦")}
function fee(t){return t>=S.freeOver||!t?0:S.delivery}
function total(){return P.reduce(function(t,x){return t+(cart[x.id]||0)*x.price},0)}
function save(){try{localStorage.setItem("dd-cart",JSON.stringify(cart))}catch(e){}}
function chips(){var cs=["All"].concat(P.map(function(x){return x.category}).filter(function(v,i,a){return v&&a.indexOf(v)===i}));
 $("chips").innerHTML=cs.map(function(c){return '<button class="chip" aria-pressed="'+(c===cat)+'" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join("")}
function grid(){var q=$("q").value.trim().toLowerCase(),s=$("sort").value;
 var l=P.filter(function(x){return (cat==="All"||x.category===cat)&&(x.name+" "+x.desc).toLowerCase().indexOf(q)>-1});
 if(s==="lo")l.sort(function(a,b){return a.price-b.price});if(s==="hi")l.sort(function(a,b){return b.price-a.price});
 $("grid").innerHTML=l.length?l.map(function(x){var off=x.oldPrice>x.price;return '<article class="card"><div class="pic">'+pic(x)+(off?'<span class="tag">Save '+Math.round((1-x.price/x.oldPrice)*100)+'%</span>':'')+'</div><div class="b"><h3>'+esc(x.name)+'</h3><div class="d">'+esc(x.desc)+'</div><div class="price">'+tk(x.price)+(off?'<s>'+tk(x.oldPrice)+'</s>':'')+'</div><button class="add" data-a="'+x.id+'"'+(x.inStock?'':' disabled')+'>'+(x.inStock?'Add to cart':'Sold out')+'</button></div></article>'}).join(""):'<div class="empty">No products found. Try another word or choose All.</div>'}
function drawCart(){var n=0,h="";P.forEach(function(x){var k=cart[x.id];if(k){n+=k;h+='<div class="row"><div class="e">'+pic(x)+'</div><div class="t">'+esc(x.name)+'<br><b>'+tk(x.price*k)+'</b></div><div class="qty"><button data-m="'+x.id+'" aria-label="Remove one">−</button><span>'+k+'</span><button data-p="'+x.id+'" aria-label="Add one">+</button></div></div>'}});
 $("items").innerHTML=h||'<div class="empty">Your cart is empty. Add something you like.</div>';
 $("cnt").textContent=n;$("total").textContent=tk(total());$("checkout").disabled=!n;save()}
function openCart(on){$("drawer").classList.toggle("on",on);$("ov").classList.toggle("on",on);if(!on)$("modal").classList.remove("on")}
$("chips").onclick=function(e){if(e.target.dataset.c){cat=e.target.dataset.c;chips();grid()}};
$("grid").onclick=function(e){var id=e.target.dataset.a;if(id){cart[id]=(cart[id]||0)+1;drawCart();e.target.textContent="Added ✓";setTimeout(function(){e.target.textContent="Add to cart"},900)}};
$("items").onclick=function(e){var m=e.target.dataset.m,p=e.target.dataset.p;if(p)cart[p]++;if(m){cart[m]--;if(cart[m]<1)delete cart[m]}drawCart()};
$("cartBtn").onclick=function(){openCart(true)};$("close").onclick=function(){openCart(false)};$("ov").onclick=function(){openCart(false)};
$("shopNow").onclick=function(){$("shop").scrollIntoView({behavior:"smooth"})};
$("q").oninput=grid;$("sort").onchange=grid;$("fn").textContent="© "+new Date().getFullYear()+" "+S.name;
$("theme").onclick=function(){var r=document.documentElement,d=r.dataset.theme==="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);r.dataset.theme=d?"light":"dark"};

$("checkout").onclick=function(){var t=total(),f=fee(t);
 $("modal").innerHTML='<h2>Delivery details</h2><label for="nm">Full name</label><input type="text" id="nm" autocomplete="name"><label for="ph">Mobile number</label><input type="tel" id="ph" placeholder="01XXXXXXXXX" autocomplete="tel"><label for="ad">Full address</label><input type="text" id="ad" autocomplete="street-address">'+
 '<label>Payment method</label><div class="pay"><label><input type="radio" name="pm" value="Cash on delivery" checked>Cash on delivery</label><label><input type="radio" name="pm" value="bKash">bKash</label><label><input type="radio" name="pm" value="Nagad">Nagad</label></div><div id="pi"></div><div class="err" id="er" role="alert"></div>'+
 '<button class="add" id="pl">Place order · '+tk(t+f)+'</button><p style="font-size:13px;color:var(--mute)">Subtotal '+tk(t)+' + delivery '+(f?tk(f):"free")+'</p>';
 $("modal").classList.add("on");
 $("modal").onchange=function(){var v=document.querySelector('input[name=pm]:checked').value;
  $("pi").innerHTML=v==="Cash on delivery"?"":'<div class="note">Send <b>'+tk(t+f)+'</b> by Send Money to <b>'+esc(v==="bKash"?S.bkash:S.nagad)+'</b>, then enter the Transaction ID below.</div><label for="tx">'+v+' Transaction ID</label><input type="text" id="tx" autocomplete="off">'};
 $("pl").onclick=place};

function place(){var nm=$("nm").value.trim(),ph=$("ph").value.trim(),ad=$("ad").value.trim(),pm=document.querySelector('input[name=pm]:checked').value,tx=$("tx")?$("tx").value.trim():"";
 if(nm.length<2)return $("er").textContent="Enter your full name.";
 if(!/^01[3-9]\d{8}$/.test(ph))return $("er").textContent="Enter a valid mobile number, like 01712345678.";
 if(ad.length<8)return $("er").textContent="Enter your full delivery address.";
 if(pm!=="Cash on delivery"&&tx.length<6)return $("er").textContent="Enter the "+pm+" Transaction ID after sending the money.";
 var t=total(),f=fee(t),no="DD"+Date.now().toString().slice(-7),lines=[];
 P.forEach(function(x){if(cart[x.id])lines.push("- "+x.name+" x"+cart[x.id]+" = "+tk(x.price*cart[x.id]))});
 var msg="New order "+no+"\nName: "+nm+"\nPhone: "+ph+"\nAddress: "+ad+"\n\n"+lines.join("\n")+"\n\nSubtotal: "+tk(t)+"\nDelivery: "+tk(f)+"\nTotal: "+tk(t+f)+"\nPayment: "+pm+(tx?" (TrxID: "+tx+")":"");
 if(S.sheetWebhook){try{fetch(S.sheetWebhook,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify({order:no,name:nm,phone:ph,address:ad,items:lines.join("; "),subtotal:t,delivery:f,total:t+f,payment:pm,trx:tx})})}catch(e){}}
 var wa="https://wa.me/"+S.whatsapp+"?text="+encodeURIComponent(msg);
 $("modal").innerHTML='<div class="ok"><div class="big">🎉</div><h2>Almost done!</h2><p>Order <b>'+no+'</b> is ready, '+esc(nm)+'. Tap the button to send it to us on WhatsApp so we can confirm and deliver.</p><a class="add" style="display:block;text-decoration:none;text-align:center" id="wa" href="'+wa+'" target="_blank" rel="noopener">Send order on WhatsApp</a><button class="add sec" id="done">Back to shop</button></div>';
 window.open(wa,"_blank");cart={};drawCart();$("done").onclick=function(){openCart(false)}}

fetch("products.json").then(function(r){return r.json()}).then(function(d){P=d;chips();grid();drawCart()}).catch(function(){$("grid").innerHTML='<div class="empty">Could not load products. Open this site through GitHub Pages or a local server, not by double-clicking the file.</div>'});
})();
