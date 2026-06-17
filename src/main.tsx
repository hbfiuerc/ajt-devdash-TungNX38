import type { Product } from "./types";
import { getAllProducts,getAllCategories } from "./api";

let allProducts: Product[] = [];
let allCategories: string[] = [];

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

    const categoryOptions = allCategories.map(cat =>`
        <option value="${cat}">${cat}</option>
    `).join("");
    
    document.body.innerHTML = `
        <h1>Cửa hàng DevDash</h1>
        <div style="margin-bottom: 20px;">
            <input type="text" id="searchInput" placeholder="Gõ tên sản phẩm..." style="padding: 5px; width: 300px;" />
            
            <select id="categorySelect" style="padding: 5px; margin-left: 10px;">
                <option value="all">Tất cả danh mục</option>
                ${categoryOptions}
            </select>
        </div>
        <div id="productList"></div>
    `

    const serchInput = document.getElementById("searchInput") as HTMLInputElement;
    const categorySelect = document.getElementById("categorySelect") as HTMLSelectElement;

    function handleFilters() {
        const keyword = serchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;

        const filtered = allProducts.filter(p => {
            const matchesKeyword = p.title.toLowerCase().includes(keyword);
            const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
            return matchesKeyword && matchesCategory;
        });

        renderProductList(filtered);

    }

    document.getElementById("searchInput")?.addEventListener("input", handleFilters);
    document.getElementById("categorySelect")?.addEventListener("change", handleFilters);
}

async function startApp() {
    try {
        document.body.innerHTML = "<h2>⏳ Đang tải dữ liệu, vui lòng chờ...</h2>";
        
        const [productsData, categoriesData] = await Promise.all([
            getAllProducts(),
            getAllCategories()
        ]);

        allProducts = productsData;
        allCategories = categoriesData;

        
        renderBaseUI(); 
        renderProductList(allProducts);
    } catch  {
        document.body.innerHTML = "<h2>❌ Lỗi tải dữ liệu. Hãy kiểm tra kết nối mạng.</h2>";
    }
}

startApp();

