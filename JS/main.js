document.addEventListener('DOMContentLoaded', function() {

    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 700, // Animation duration in ms
        once: true, // Whether animation should happen only once - while scrolling down
        offset: 50, // Offset (in px) from the original trigger point
        delay: 50, // Values from 0 to 3000, with step 50ms
    });

    // Back to top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        // Scroll to top when button is clicked
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent potential hash jump
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); // Prevent default only if target exists
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Optional: Close navbar collapse on click (if exists)
                    const navbarCollapse = document.querySelector('.navbar-collapse.show');
                    if (navbarCollapse) {
                        new bootstrap.Collapse(navbarCollapse).hide();
                    }
                }
            }
        });
    });

    // Toggle active class in navbar based on current page
    try {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Default to index.html if path is '/'
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                 // Remove active class from all links first
                 document.querySelectorAll('.navbar-nav .nav-link.active').forEach(activeLink => {
                    activeLink.classList.remove('active');
                    activeLink.removeAttribute('aria-current'); // Remove aria-current as well
                 });
                 // Add active class to the current link
                link.classList.add('active');
                link.setAttribute('aria-current', 'page'); // Add aria-current for accessibility
            }
        });
    } catch (e) {
        console.error("Error setting active nav link:", e);
    }


    // Animated counters for statistics (if any exist on page)
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    const duration = 1500; // Duration in ms
                    let startTime = null;

                    const step = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        const currentCount = Math.floor(progress * target);
                        counter.innerText = currentCount.toLocaleString(); // Add commas

                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            counter.innerText = target.toLocaleString(); // Ensure final value is exact
                        }
                    };
                    window.requestAnimationFrame(step);
                    observer.unobserve(counter); // Animate only once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% visible

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Animated progress bars (if any exist on page)
    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('aria-valuenow') + '%';
                    progressBar.style.width = width;
                    observer.unobserve(progressBar); // Animate only once
                }
            });
        }, { threshold: 0.2 }); // Trigger when 20% visible

        progressBars.forEach(progressBar => {
             progressBar.style.width = '0%'; // Start at 0 width
            progressObserver.observe(progressBar);
        });
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        const pages = [
             { title: 'Time Management Home', url: 'index.html', content: 'Overview paradox guide impact benefits' },
             { title: 'Scientific Foundations', url: 'science.html', content: 'Research evidence psychology meta-analysis performance wellbeing stress evolution' },
             { title: 'Theoretical Frameworks', url: 'frameworks.html', content: 'Eisenhower Matrix GTD Getting Things Done Pomodoro Technique Time Blocking Pareto 80/20 ABC Method models' },
             { title: 'Practical Strategies', url: 'strategies.html', content: 'Planning execution review goals SMART prioritization scheduling focus procrastination' },
             { title: 'Tools & Technology', url: 'tools.html', content: 'Digital analog software apps planner notebook calendar task focus project notes Todoist Asana Trello Notion Obsidian' },
             { title: 'Case Studies', url: 'case-studies.html', content: 'Real-world examples success stories challenges CEO executive entrepreneur student writer BuJo' },
             { title: 'Future Trends', url: 'future.html', content: 'Emerging AI chronobiology cognitive load sustainability asynchronous wellbeing ROWE VR AR' },
             { title: 'Resources', url: 'resources.html', content: 'Books articles courses communities blogs HBR Cal Newport James Clear Atomic Habits Deep Work GTD' },
             { title: 'Interactive Visualizations', url: 'visualizations.html', content: 'Charts graphs data Eisenhower evolution tools comparison meta-analysis 3D Three.js' }
        ];

        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase().trim();
            searchResults.innerHTML = ''; // Clear previous results

            if (searchTerm.length > 2) {
                searchResults.style.display = 'block';
                const results = pages.filter(page =>
                    page.title.toLowerCase().includes(searchTerm) ||
                    page.content.toLowerCase().includes(searchTerm)
                );

                if (results.length > 0) {
                    results.forEach(result => {
                        const resultItem = document.createElement('div');
                        resultItem.classList.add('search-result-item');
                        // Highlight matched term (simple version)
                        const titleHighlight = result.title.replace(new RegExp(searchTerm, 'gi'), (match) => `<mark>${match}</mark>`);
                        resultItem.innerHTML = `
                            <a href="${result.url}" class="d-block p-2 text-decoration-none">
                                <h6 class="mb-0 small">${titleHighlight}</h6>
                                <small class="text-muted d-block text-truncate">${result.content}</small>
                            </a>
                        `;
                        searchResults.appendChild(resultItem);
                    });
                } else {
                    searchResults.innerHTML = '<div class="p-2 text-muted small">No results found</div>';
                }
            } else {
                searchResults.style.display = 'none';
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
             // Check if the click is outside the search input AND outside the search results container
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
         // Close search results on Escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                searchResults.style.display = 'none';
            }
        });
    }


    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to set theme
    const setTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = true;
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = false;
            localStorage.setItem('theme', 'light');
        }
         // Dispatch event for other scripts (like Three.js) to listen to
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: theme } }));
    };

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark.matches ? 'dark' : 'light');
    }

    // Listen for toggle change
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            setTheme(this.checked ? 'dark' : 'light');
        });
    }

    // Listen for system preference changes
    prefersDark.addEventListener('change', (e) => {
        // Only change if no theme is explicitly saved by the user
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });


    // Initialize charts if Chart.js is available and charts exist
    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        Chart.defaults.plugins.tooltip.titleFont = { size: 14, weight: 'bold' };
        Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };

        const updateChartColors = (theme) => {
            const isDark = theme === 'dark';
            const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const labelColor = isDark ? '#e0e0e0' : '#333';
            const titleColor = isDark ? '#f0f0f0' : '#111';

            Chart.defaults.color = labelColor; // Default text color
            Chart.defaults.borderColor = gridColor; // Default border color for scales etc.

            // Update existing chart instances if they exist
            Chart.instances.forEach(instance => {
                 instance.options.scales.x.grid.color = gridColor;
                 instance.options.scales.x.ticks.color = labelColor;
                 instance.options.scales.x.title.color = titleColor;
                 instance.options.scales.y.grid.color = gridColor;
                 instance.options.scales.y.ticks.color = labelColor;
                 instance.options.scales.y.title.color = titleColor;
                 instance.options.plugins.legend.labels.color = labelColor;
                 instance.options.plugins.title.color = titleColor;
                 instance.update();
            });
        }

        // Apply initial chart theme based on current theme
        updateChartColors(localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light'));

         // Listen for theme changes to update charts
        window.addEventListener('themeChanged', (e) => {
            updateChartColors(e.detail.theme);
        });

        // Meta-analysis results chart
        const metaAnalysisChartCtx = document.getElementById('meta-analysis-chart')?.getContext('2d');
        if (metaAnalysisChartCtx) {
            new Chart(metaAnalysisChartCtx, {
                type: 'bar',
                data: {
                    labels: ['Job Performance', 'Academic Achievement', 'Wellbeing', 'Distress (Reduced)'],
                    datasets: [{
                        label: 'Correlation with Time Management',
                        data: [0.25, 0.33, 0.43, 0.28], // Using positive value for distress reduction
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.7)', // Blue
                            'rgba(75, 192, 192, 0.7)', // Teal
                            'rgba(153, 102, 255, 0.7)',// Purple
                            'rgba(255, 99, 132, 0.7)' // Red (representing reduction)
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y', // Make it horizontal bar chart
                    scales: {
                         x: {
                            beginAtZero: true,
                            max: 0.5, // Set max for better comparison
                            title: { display: true, text: 'Correlation Coefficient (r)' }
                         },
                         y: { title: { display: true, text: 'Outcome Measures' } }
                    },
                    plugins: {
                        title: { display: true, text: 'Time Management Effectiveness (Meta-Analysis)', font: { size: 16 } },
                        legend: { display: false }, // Hide legend as label explains it
                        tooltip: {
                            callbacks: { label: (context) => `Correlation (r): ${context.raw}` }
                        }
                    }
                }
            });
        }

        // Tools comparison chart
        const toolsComparisonChartCtx = document.getElementById('tools-comparison-chart')?.getContext('2d');
        if (toolsComparisonChartCtx) {
            new Chart(toolsComparisonChartCtx, {
                type: 'radar',
                data: {
                    labels: ['Ease of Use', 'Features', 'Cross-Platform', 'Customization', 'Integration', 'Cost'],
                    datasets: [
                        {
                            label: 'Digital Tools',
                            data: [3.5, 4.8, 4.5, 4.2, 4.7, 3.2],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                            pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                        },
                        {
                            label: 'Analog Tools',
                            data: [4.7, 2.8, 1.5, 4.8, 2.0, 4.5],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                            pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                             angleLines: { display: true },
                             suggestedMin: 0, suggestedMax: 5,
                             pointLabels: { font: { size: 11 } },
                             ticks: { backdropPadding: 4, stepSize: 1 }
                        }
                    },
                    plugins: {
                        title: { display: true, text: 'Digital vs. Analog Tools Comparison', font: { size: 16 } },
                        legend: { position: 'top' }
                    }
                }
            });
        }

        // Time management evolution chart
        const evolutionChartCtx = document.getElementById('evolution-chart')?.getContext('2d');
        if (evolutionChartCtx) {
            new Chart(evolutionChartCtx, {
                type: 'line',
                data: {
                    labels: ['1950s', '1970s', '1990s', '2010s', '2020s+'],
                    datasets: [
                        {
                            label: 'Efficiency Focus', data: [4.5, 4.8, 4.3, 3.5, 3.2], tension: 0.3, fill: true,
                            borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.1)', pointRadius: 4
                        },
                        {
                            label: 'Effectiveness Focus', data: [1.2, 2.3, 4.2, 4.6, 4.7], tension: 0.3, fill: true,
                            borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.1)', pointRadius: 4
                        },
                        {
                            label: 'Wellbeing Integration', data: [0.5, 1.0, 2.3, 4.0, 4.8], tension: 0.3, fill: true,
                            borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.1)', pointRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 5, title: { display: true, text: 'Emphasis Level (0-5)' } },
                        x: { title: { display: true, text: 'Approx. Decade' } }
                    },
                    plugins: {
                        title: { display: true, text: 'Evolution of Time Management Focus Areas', font: { size: 16 } },
                        legend: { position: 'top' }
                    },
                    interaction: { intersect: false, mode: 'index' }, // Tooltip shows all datasets on hover
                }
            });
        }
    }


    // --- START: Three.js Code for Tool Visualization ---
    const threeContainer = document.getElementById('threejs-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const tooltip3D = document.getElementById('tooltip-3d'); // Renamed to avoid conflict

    if (threeContainer) {
        // Dynamically import Three.js modules using the import map
        Promise.all([
            import('three'),
            import('three/addons/controls/OrbitControls.js'),
            import('three/addons/loaders/FontLoader.js'), // Only if needed for text geometry
            import('three/addons/geometries/TextGeometry.js') // Only if needed for text geometry
        ]).then(([THREE, { OrbitControls } /*, { FontLoader }, { TextGeometry } */]) => { // Comment out Font/Text if not used

            // Scene Setup
            const scene = new THREE.Scene();
            const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            scene.background = new THREE.Color(currentTheme === 'dark' ? 0x1a1a1a : 0xeeeeee); // Match background

            // Camera
            const camera = new THREE.PerspectiveCamera(60, threeContainer.clientWidth / threeContainer.clientHeight, 0.1, 1000);
            camera.position.set(0, 5, 12); // Adjusted position

            // Renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = true; // Enable shadows
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            threeContainer.appendChild(renderer.domElement);
            if (loadingIndicator) loadingIndicator.style.display = 'none';

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
            directionalLight.position.set(8, 15, 10);
            directionalLight.castShadow = true;
             // Configure shadow properties
            directionalLight.shadow.mapSize.width = 1024;
            directionalLight.shadow.mapSize.height = 1024;
            directionalLight.shadow.camera.near = 0.5;
            directionalLight.shadow.camera.far = 50;
            directionalLight.shadow.camera.left = -10;
            directionalLight.shadow.camera.right = 10;
            directionalLight.shadow.camera.top = 10;
            directionalLight.shadow.camera.bottom = -10;
            scene.add(directionalLight);
             // Optional: Add a light helper
             // const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
             // scene.add(lightHelper);
             // const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
            // scene.add(shadowHelper);


            // Controls
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.minDistance = 4;
            controls.maxDistance = 30;
            controls.target.set(0, 1, 0); // Point controls slightly higher

             // Ground Plane for Shadows
             const planeGeometry = new THREE.PlaneGeometry(20, 20);
             const planeMaterial = new THREE.MeshStandardMaterial({ color: currentTheme === 'dark' ? 0x404040 : 0xc0c0c0, side: THREE.DoubleSide, roughness: 0.8 });
             const plane = new THREE.Mesh(planeGeometry, planeMaterial);
             plane.rotation.x = -Math.PI / 2; // Rotate to be horizontal
             plane.position.y = -1; // Position slightly below objects
             plane.receiveShadow = true; // Allow plane to receive shadows
             scene.add(plane);


            // Tool Category Geometries & Materials
             const categories = [
                { name: "Task Mgmt", geometry: new THREE.BoxGeometry(1.5, 1.5, 1.5), color: 0x0d6efd, position: [-4, 0, 0] },
                { name: "Calendar", geometry: new THREE.SphereGeometry(1, 32, 32), color: 0x198754, position: [0, 0, -3] },
                { name: "Focus", geometry: new THREE.ConeGeometry(0.8, 2.5, 32), color: 0xffc107, position: [4, 0.25, 0] }, // Adjusted height/pos
                { name: "Project Mgmt", geometry: new THREE.OctahedronGeometry(1.2), color: 0xdc3545, position: [0, 0.2, 3] }, // Octahedron instead of Tetrahedron
                { name: "Note Taking", geometry: new THREE.CylinderGeometry(0.7, 0.7, 2, 32), color: 0x6c757d, position: [-2, 0, 4] } // Adjusted size/pos
            ];

            const objects = []; // To store meshes for raycasting
            const initialScales = new Map(); // Store initial scales

            categories.forEach(cat => {
                const material = new THREE.MeshStandardMaterial({
                     color: cat.color,
                     roughness: 0.5,
                     metalness: 0.1
                 });
                const mesh = new THREE.Mesh(cat.geometry, material);
                mesh.position.set(cat.position[0], cat.position[1] + cat.geometry.parameters.height / 2 || cat.position[1] + (cat.geometry.parameters.radius || 1) , cat.position[2]); // Adjust y based on geometry center
                mesh.castShadow = true; // Enable shadow casting
                mesh.receiveShadow = false; // Objects generally don't receive shadows on themselves here
                mesh.userData = { name: cat.name, initialColor: new THREE.Color(cat.color) }; // Store name and initial color
                scene.add(mesh);
                objects.push(mesh);
                initialScales.set(mesh.uuid, mesh.scale.clone()); // Store initial scale
            });

            // Raycasting for Hover Tooltips & Interaction
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(-10, -10); // Initialize off-screen
            let intersectedObject = null;
            const targetScale = 1.15; // Scale factor on hover
            const animationSpeed = 0.1;

            function onPointerMove(event) {
                const rect = renderer.domElement.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                // Update tooltip position (relative to the container for better placement)
                 if (tooltip3D) {
                     const containerRect = threeContainer.getBoundingClientRect();
                    tooltip3D.style.left = `${event.clientX - containerRect.left + 15}px`; // Position relative to container
                    tooltip3D.style.top = `${event.clientY - containerRect.top + 15}px`;
                 }
            }
             // Reset mouse when pointer leaves the canvas
            renderer.domElement.addEventListener('pointerleave', () => {
                mouse.x = -10;
                mouse.y = -10;
            });


            function checkIntersections() {
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(objects);

                if (intersects.length > 0) {
                    const newIntersected = intersects[0].object;
                    if (intersectedObject !== newIntersected) {
                         // Reset the previously intersected object if it exists
                         if (intersectedObject) {
                              // No longer setting emissive, scale handles visual feedback
                         }
                         intersectedObject = newIntersected;
                         if (tooltip3D && intersectedObject.userData.name) {
                            tooltip3D.style.display = 'block';
                            tooltip3D.textContent = intersectedObject.userData.name;
                        }
                    }
                } else {
                     if (intersectedObject) {
                         // Reset previously intersected object
                     }
                     intersectedObject = null;
                     if (tooltip3D) {
                        tooltip3D.style.display = 'none';
                     }
                }

                // Animate scale for all objects based on intersection
                 objects.forEach(obj => {
                    const isIntersected = intersectedObject === obj;
                    const currentScale = obj.scale.x; // Assuming uniform scaling
                    const target = isIntersected ? targetScale : initialScales.get(obj.uuid).x;
                    const newScale = THREE.MathUtils.lerp(currentScale, target, animationSpeed); // Smooth interpolation
                     obj.scale.set(newScale, newScale, newScale);
                 });
            }

            // Handle Window Resize
            window.addEventListener('resize', onWindowResize, false);
            function onWindowResize() {
                camera.aspect = threeContainer.clientWidth / threeContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
            }

            // Handle Mouse Move for Tooltips
            threeContainer.addEventListener('pointermove', onPointerMove);

             // Handle Theme Change for 3D view
             window.addEventListener('themeChanged', (e) => {
                const isDark = e.detail.theme === 'dark';
                scene.background.set(isDark ? 0x1a1a1a : 0xeeeeee);
                plane.material.color.set(isDark ? 0x404040 : 0xc0c0c0);
            });


            // Animation Loop
            function animate() {
                requestAnimationFrame(animate);
                controls.update();
                checkIntersections(); // Check intersections and update scales
                renderer.render(scene, camera);
            }

            animate();

        }).catch(error => {
            console.error("Failed to load Three.js modules:", error);
            if (loadingIndicator) loadingIndicator.textContent = 'Error loading 3D view.';
            if (threeContainer) threeContainer.innerHTML = '<p class="text-danger text-center p-3">Could not load 3D visualization. Please ensure your browser supports modern JavaScript (ES modules).</p>';
        });
    }
    // --- END: Three.js Code ---

}); // End of DOMContentLoaded