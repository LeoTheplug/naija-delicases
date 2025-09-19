
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const nav = document.getElementById('nav');
        const overlay = document.getElementById('overlay');
        
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on overlay
        overlay.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Cart functionality
        const cartIcon = document.getElementById('cartIcon');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        const closeCart = document.getElementById('closeCart');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartCountElement = document.querySelector('.cart-count');
        const cartNotification = document.getElementById('cartNotification');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const continueShoppingBtn = document.getElementById('continueShopping');
        const checkoutForm = document.getElementById('checkoutForm');
        const closeCheckout = document.getElementById('closeCheckout');
        const orderForm = document.getElementById('orderForm');
        const orderConfirmation = document.getElementById('orderConfirmation');
        const backToMenuBtn = document.getElementById('backToMenu');
        
        let cart = [];
        let total = 0;
        
        // Format price to Nigerian Naira
        function formatPrice(price) {
            return `₦${price.toLocaleString('en-NG')}`;
        }
        
        // Open cart sidebar
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close cart sidebar
        closeCart.addEventListener('click', closeCartSidebar);
        cartOverlay.addEventListener('click', closeCartSidebar);
        continueShoppingBtn.addEventListener('click', closeCartSidebar);
        
        function closeCartSidebar() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Open checkout form
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty. Add some items first!');
                return;
            }
            closeCartSidebar();
            checkoutForm.classList.add('active');
            cartOverlay.classList.add('active');
        });
        
        // Close checkout form
        closeCheckout.addEventListener('click', () => {
            checkoutForm.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
        
        // Handle order form submission
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real application, you would send this data to a server
            checkoutForm.classList.remove('active');
            orderConfirmation.classList.add('active');
        });
        
        // Back to menu from order confirmation
        backToMenuBtn.addEventListener('click', () => {
            orderConfirmation.classList.remove('active');
            cartOverlay.classList.remove('active');
            // Clear the cart after successful order
            cart = [];
            updateCartCount();
            updateCartDisplay();
        });
        
        // Add to cart functionality
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Add 'added' class for animation
                this.classList.add('added');
                
                // Get item details from data attributes
                const itemName = this.getAttribute('data-name');
                const itemPrice = parseFloat(this.getAttribute('data-price'));
                const itemImg = this.getAttribute('data-img');
                
                // Check if item already exists in cart
                const existingItem = cart.find(item => item.name === itemName);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    // Add item to cart
                    cart.push({
                        name: itemName,
                        price: itemPrice,
                        img: itemImg,
                        quantity: 1
                    });
                }
                
                // Update cart count
                updateCartCount();
                
                // Update cart display
                updateCartDisplay();
                
                // Show notification
                cartNotification.querySelector('span').textContent = `${itemName} added to cart!`;
                cartNotification.classList.add('show');
                
                // Reset button after animation
                setTimeout(() => {
                    this.classList.remove('added');
                }, 2000);
                
                // Hide notification after 3 seconds
                setTimeout(() => {
                    cartNotification.classList.remove('show');
                }, 3000);
                
                // Add subtle vibration effect to cart notification
                cartNotification.animate([
                    { transform: 'translateX(5px)' },
                    { transform: 'translateX(-5px)' },
                    { transform: 'translateX(0)' }
                ], {
                    duration: 300,
                    iterations: 3
                });
            });
        });
        
        // Update cart count
        function updateCartCount() {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = count;
        }
        
        // Update cart display
        function updateCartDisplay() {
            // Clear current cart items
            cartItems.innerHTML = '';
            
            // Reset total
            total = 0;
            
            // Add each item to cart display
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            // Update total
            cartTotal.textContent = `Total: ${formatPrice(total)}`;
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.quantity-btn.plus').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    cart[index].quantity += 1;
                    updateCartDisplay();
                    updateCartCount();
                });
            });
            
            document.querySelectorAll('.quantity-btn.minus').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    if (cart[index].quantity > 1) {
                        cart[index].quantity -= 1;
                    } else {
                        cart.splice(index, 1);
                    }
                    updateCartDisplay();
                    updateCartCount();
                });
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    cart.splice(index, 1);
                    updateCartDisplay();
                    updateCartCount();
                });
            });
        }
        
        // Add subtle animations to menu items when they come into view
        const menuItems = document.querySelectorAll('.menu-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.5s ease-in-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        menuItems.forEach(item => {
            item.style.opacity = '0';
            observer.observe(item);
        });
    