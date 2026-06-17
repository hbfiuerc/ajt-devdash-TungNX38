import type { Product } from "./types";
import { getAllProducts } from "./api";

let allProducts: Product[] = [];

function renderProductList(productToRender: Product[]){
    const listHTML = productToRender.map(p => `
        <div style="border:1px solid #ccc; margin:10px ; padding:10px;">
            <h3>${p.title}</h3>
            <p> Gia: ${p.price}</p>   
        </div> 
    `).join("");

    const listContainer = document.getElementById("productList");
    if(listContainer){
        listContainer.innerHTML = listHTML;
    }
    
}

function renderBaseUI(){
    
    document.body.innerHTML = `
        <h1>Cua hang DevDash</h1>
        <input type="text" id="searchInput" placeholder="Go san pham tim kiem..."/>
        <div id="productList"></div> 
    `

    document.getElementById("searchInput")?.addEventListener("input", (event)=>{
        const keyword = (event.target as HTMLInputElement).value.toLowerCase();
        const filtered = allProducts.filter(p => p.title.toLowerCase().includes(keyword)); 
        renderProductList (filtered);
    })
}

async function startApp() {
    try {
        document.body.innerHTML = "<h2>⏳ Đang tải dữ liệu, vui lòng chờ...</h2>";
        
        allProducts = await getAllProducts(); 
        
        renderBaseUI(); 
        renderProductList(allProducts);
    } catch  {
        document.body.innerHTML = "<h2>❌ Lỗi tải dữ liệu. Hãy kiểm tra kết nối mạng.</h2>";
    }
}

startApp();

