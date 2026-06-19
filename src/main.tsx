import type { AppState, Product } from "./types";
import { getAllProducts, getAllCategories, getProductById } from "./api"; // Import thêm getProductById


let allProducts: Product[] = [];
let allCategories: string[] = [];
let currentState: AppState = { status: "idle" };


function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

async function loadProductDetail(id: number) {
    try {
        currentState = { status: "loading" };
        renderStateBasedUI(currentState);
        
        const product = await getProductById(id);
        
        currentState = { status: "detail", product: product };
        renderStateBasedUI(currentState);
    } catch (error: unknown) {
        let errorMessage = "Lỗi khi tải chi tiết sản phẩm";
        if (error instanceof Error) errorMessage = error.message;
        currentState = { status: "error", message: errorMessage };
        renderStateBasedUI(currentState);
    }
}

function renderProductList(productsToRender: Product[]) {
    const listHTML = productsToRender.map(p => `
        <div style="border:1px solid #ccc; margin:10px ; padding:10px;">
            <span style="font-size: 12px; color: gray;">${p.category.toUpperCase()}</span>
            <h3>${p.title}</h3>
            <p>Giá: $${p.price}</p>   
            <button class="detail-btn" data-id="${p.id}" style="cursor: pointer; padding: 5px;">Xem chi tiết</button>
        </div> 
    `).join("");

    const listContainer = document.getElementById("productList");
    if (listContainer) {
        listContainer.innerHTML = listHTML;
        
    
        const buttons = listContainer.querySelectorAll('.detail-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                // Ép kiểu an toàn và lấy ra ID của sản phẩm
                const target = event.target as HTMLButtonElement;
                const productId = Number(target.getAttribute('data-id'));
                loadProductDetail(productId); 
            });
        });
    }
}

function renderBaseUI() {
    const categoryOptions = allCategories.map(cat => 
        `<option value="${cat}">${cat}</option>`
    ).join("");

    const searchUIContainer = document.getElementById("searchUI");
    if (searchUIContainer) {
        searchUIContainer.innerHTML = `
            <div style="margin-bottom: 20px;">
                <input type="text" id="searchInput" placeholder="Gõ tên sản phẩm..." style="padding: 5px; width: 300px;" />
                <select id="categorySelect" style="padding: 5px; margin-left: 10px;">
                    <option value="all">Tất cả danh mục</option>
                    ${categoryOptions}
                </select>
            </div>
        `;
    }

    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    const categorySelect = document.getElementById("categorySelect") as HTMLSelectElement;

    function handleFilter() {
        if (!searchInput || !categorySelect) return;
        const keyword = searchInput.value.toLowerCase();
        const selectedCat = categorySelect.value;
        
        const filtered = allProducts.filter(p => {
            const matchKeyword = p.title.toLowerCase().includes(keyword);
            const matchCategory = selectedCat === "all" || p.category === selectedCat;
            return matchKeyword && matchCategory; 
        }); 
        
        renderProductList(filtered);
    }

    const debouncedSearch = debounce(handleFilter, 300);
    
    if (searchInput) searchInput.addEventListener("input", debouncedSearch);
    if (categorySelect) categorySelect.addEventListener("change", handleFilter);
}

function renderStateBasedUI(state: AppState) {
    const appContainer = document.getElementById("app") || document.body;

    switch (state.status) {
        case "idle":
            appContainer.innerHTML = "<h2>👋 Chào mừng đến với DevDash! Bấm nút để tải.</h2>";
            break;
            
        case "loading":
            appContainer.innerHTML = "<h2>⏳ Hệ thống đang tải dữ liệu...</h2>";
            break;
            
        case "error":
            appContainer.innerHTML = `
                <h2 style="color: red;">❌ Lỗi: ${state.message}</h2>
                <button id="retryBtn">Thử lại</button>
            `;
            document.getElementById("retryBtn")?.addEventListener("click", startApp);
            break;
            
        case "success":
            appContainer.innerHTML = `
                <h1>Cửa hàng DevDash</h1>
                <div id="searchUI"></div>
                <div id="productList"></div>
            `;
            renderBaseUI(); 
            renderProductList(state.data); 
            break;
            
        
        case "detail":
            appContainer.innerHTML = `
                <div style="padding: 20px;">
                    <button id="backBtn" style="margin-bottom: 20px; padding: 10px; cursor: pointer;">⬅ Quay lại danh sách</button>
                    <div style="border: 2px solid #4CAF50; padding: 20px; border-radius: 8px;">
                        <span style="background: #eee; padding: 5px; border-radius: 4px;">${state.product.category}</span>
                        <h2>${state.product.title}</h2>
                        <img src="${state.product.image}" alt="${state.product.title}" style="max-width: 200px; display: block; margin: 10px 0;" />
                        <h3 style="color: #4CAF50;">Giá: $${state.product.price}</h3>
                        <p style="line-height: 1.6;">${state.product.description}</p>
                    </div>
                </div>
            `;
            // Bấm nút quay lại thì đổi trạng thái về Success 
            document.getElementById("backBtn")?.addEventListener("click", () => {
                currentState = { status: "success", data: allProducts };
                renderStateBasedUI(currentState);
            });
            break;
            
        default:
            const _exhaustiveCheck: never = state; 
            return _exhaustiveCheck;
    }
}

async function startApp() {
    try {
        currentState = { status: "loading" };
        renderStateBasedUI(currentState);
        
        const [productsData, categoriesData] = await Promise.all([
            getAllProducts(),
            getAllCategories()
        ]); 
        
        allProducts = productsData;
        allCategories = categoriesData;
        
        currentState = { status: "success", data: productsData };
        renderStateBasedUI(currentState);
        
    } catch (error: unknown) {
        let errorMessage = "Đã xảy ra lỗi không xác định";
        if (error instanceof Error) errorMessage = error.message;
        
        currentState = { status: "error", message: errorMessage };
        renderStateBasedUI(currentState);
    }
}

startApp();