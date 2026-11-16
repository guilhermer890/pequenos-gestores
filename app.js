const questions=[
{q:"Tens 5 € e compras um brinquedo por 3 €. Quanto dinheiro sobra?",a:["1 €","2 €","3 €"],c:1,e:"5 € - 3 € = 2 €. Muito bem!"},
{q:"O que significa poupar dinheiro?",a:["Gastar tudo","Guardar dinheiro para o futuro","Comprar mais brinquedos"],c:1,e:"Poupar é guardar dinheiro para utilizar mais tarde."},
{q:"Queres comprar uma bicicleta. O que deves fazer?",a:["Planear e juntar dinheiro","Gastar todo o dinheiro","Pedir sempre mais dinheiro"],c:0,e:"Planear ajuda-te a alcançar os teus objetivos."},
{q:"Qual destas opções é uma necessidade?",a:["Um videojogo","Um brinquedo novo","Alimentação"],c:2,e:"A alimentação é uma necessidade essencial."},
{q:"Encontras um produto mais barato com a mesma qualidade. O que fazes?",a:["Escolhes o mais caro","Comparas e escolhes bem","Compras os dois"],c:1,e:"Comparar preços é uma boa forma de gerir o dinheiro."}
];
const products=[{n:"Maçã",e:"🍎",p:1},{n:"Pão",e:"🥖",p:2},{n:"Leite",e:"🥛",p:2},{n:"Brinquedo",e:"🧸",p:4},{n:"Livro",e:"📚",p:3}];
let points=0,qi=0,answered=false,spent=0,cart=[];
const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));$(id).classList.remove("hidden");window.scrollTo(0,0)}
function updatePoints(){ $("points").textContent=points; }
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.go)));
function startQuiz(){qi=0;answered=false;renderQuestion();show("quiz")}
function renderQuestion(){const q=questions[qi];$("q-count").textContent=`Pergunta ${qi+1} de ${questions.length}`;$("q-progress").style.width=`${(qi+1)/questions.length*100}%`;$("q-text").textContent=q.q;$("q-options").innerHTML="";$("q-feedback").innerHTML="";$("q-next").classList.add("hidden");$("q-next").textContent=qi===questions.length-1?"Ver resultado":"Próxima pergunta";q.a.forEach((a,i)=>{const b=document.createElement("button");b.className="option";b.textContent=String.fromCharCode(65+i)+". "+a;b.addEventListener("click",()=>answerQuestion(i));$("q-options").append(b)})}
function answerQuestion(i){if(answered)return;answered=true;const q=questions[qi];[...$("q-options").children].forEach((b,j)=>{b.disabled=true;if(j===q.c)b.classList.add("correct");if(j===i&&i!==q.c)b.classList.add("wrong")});if(i===q.c){points+=10;updatePoints();$("q-feedback").innerHTML=`<p class="feedback">🎉 Certo! +10 pontos. ${q.e}</p>`}else{$("q-feedback").innerHTML=`<p class="feedback" style="background:#fff3f1;color:#8d4842">💡 Boa tentativa! ${q.e}</p>`}$("q-next").classList.remove("hidden")}
$("q-next").addEventListener("click",()=>{if(qi<questions.length-1){qi++;answered=false;renderQuestion()}else{$("quiz-result").textContent=`${points} ⭐ pontos`;show("quizend")}});
$("quiz-retry").addEventListener("click",startQuiz);
document.querySelector('[data-go="quiz"]').addEventListener("click",startQuiz);
function renderProducts(){$("products").innerHTML="";products.forEach(p=>{const card=document.createElement("div");card.className="product";const emoji=document.createElement("div");emoji.className="emoji";emoji.textContent=p.e;const name=document.createElement("b");name.textContent=p.n;const price=document.createElement("span");price.textContent=p.p+" €";const btn=document.createElement("button");btn.textContent="Comprar";btn.disabled=spent+p.p>5;btn.addEventListener("click",()=>{if(spent+p.p<=5){spent+=p.p;cart.push(p);renderShop()}});card.append(emoji,name,price,btn);$("products").append(card)})}
function renderShop(){$("remaining").textContent=(5-spent).toFixed(2).replace(".",",")+" €";$("spent-label").textContent=`Já gastaste ${spent} € de 5 €`;$("budget-fill").style.width=(spent/5*100)+"%";$("basket-total").textContent=`Total: ${spent} €`;$("basket-items").textContent=cart.length?cart.map(p=>p.e+" "+p.n).join(" · "):"Ainda não escolheste produtos.";$("shop-message").textContent=spent===5?"Excelente! Utilizaste todo o orçamento sem o ultrapassar.":spent>0?`Boa gestão! Ainda tens ${5-spent} € disponíveis.`:"";renderProducts()}
$("shop-reset").addEventListener("click",()=>{spent=0;cart=[];renderShop()});
document.querySelector('[data-go="shop"]').addEventListener("click",()=>{spent=0;cart=[];renderShop();show("shop")});
const savingAnswers=["Gastar os 10 € em doces","Guardar dinheiro até conseguir comprar a bicicleta","Desistir de poupar"];
let savingChoice=null,savingAnswered=false;
function renderSaving(){savingChoice=null;savingAnswered=false;$("saving-feedback").innerHTML="";$("saving-again").classList.add("hidden");$("saving-options").innerHTML="";savingAnswers.forEach((a,i)=>{const b=document.createElement("button");b.className="option";b.textContent=a;b.addEventListener("click",()=>{if(savingAnswered)return;savingChoice=i;[...$("saving-options").children].forEach((x,j)=>{x.disabled=true;if(j===1)x.classList.add("correct");if(j===i&&i!==1)x.classList.add("wrong")});savingAnswered=true;if(i===1){points+=10;updatePoints();$("saving-feedback").innerHTML='<p class="feedback">🎉 Excelente! +10 pontos. Guardar dinheiro ajuda-te a alcançar objetivos.</p>'}else{$("saving-feedback").innerHTML='<p class="feedback" style="background:#fff3f1;color:#8d4842">💡 A melhor opção é guardar dinheiro até conseguires comprar a bicicleta.</p>'}$("saving-again").classList.remove("hidden")});$("saving-options").append(b)})}
$("saving-again").addEventListener("click",renderSaving);
document.querySelector('[data-go="saving"]').addEventListener("click",()=>{renderSaving();show("saving")});
if("serviceWorker" in navigator && location.protocol.startsWith("http")){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(err=>console.log("Service worker:",err)))}
