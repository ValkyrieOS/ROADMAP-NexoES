document.addEventListener('DOMContentLoaded', () => {
    const data = {
        "phases": [
            {
                "name": "ALPHA",
                "features": [
                    {
                        "name": "Canales para hablar con todos de cualquier categoría y cosa",
                        "status": "in-progress",
                        "assigned_users": ["Its_edurneee", "Sebas"],
                        "user_limit": 2
                    },
                    {
                        "name": "Canales de voz automáticos con el bot",
                        "status": "in-progress",
                        "assigned_users": ["alexguai2012"],
                        "user_limit": 1
                    },
                    {
                        "name": "Canales para el staff útiles para la organización",
                        "status": "in-progress",
                        "assigned_users": ["Its_edurneee", "Sebas"],
                        "user_limit": 2
                    },
                    {
                        "name": "Canales básicos para divertirse",
                        "status": "in-progress",
                        "assigned_users": ["Its_edurneee", "Sebas", "MagmaCube200"],
                        "user_limit": 3
                    },
                    {
                        "name": "Roles para cada comunidad autónoma",
                        "status": "in-progress",
                        "assigned_users": ["Its_edurneee", "Sebas"],
                        "user_limit": 2
                    },
                    {
                        "name": "Sistema de bienvenida automatizado",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 2,
                        "new": true
                    },
                    {
                        "name": "Canales de anuncios y actualizaciones",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 2,
                        "new": true
                    },
                    {
                        "name": "Sistema de moderación básica",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 2,
                        "new": true
                    },
                    {
                        "name": "Canales de sugerencias",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 2,
                        "new": true
                    },
                    {
                        "name": "Personalización visual del servidor",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 2,
                        "new": true
                    },
                    {
                        "name": "Canales de recursos o preguntas frecuentes",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 2,
                        "new": true
                    }
                ],
                "current": true
            },
            {
                "name": "BETA",
                "features": [
                    {
                        "name": "Sistema de economía medio formado",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 4,
                        "new": true
                    },
                    {
                        "name": "Categorías separadas por cada comunidad autónoma",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 5,
                        "new": true
                    },
                    {
                        "name": "Canales para sorteos y quedadas con embeds",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 3,
                        "new": true
                    },
                    {
                        "name": "Sistema de niveles por actividad en el servidor",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 5,
                        "new": true
                    },
                    {
                        "name": "Sistema de recompensas por niveles y roles especiales",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 4,
                        "new": true
                    },
                    {
                        "name": "Eventos programados con recordatorios y gestión automática",
                        "status": "pending",
                        "assigned_users": [],
                        "user_limit": 3,
                        "new": true
                    }
                ],
                "current": false
            }
        ]
    };

    try {
        const roadmapContainer = document.getElementById("roadmap-container");
        let currentPopup = null;

        function createUserPopup(feature, clickEvent) {
            // Remove existing popup if any
            if (currentPopup) {
                currentPopup.remove();
            }

            // Prevent event from bubbling up
            clickEvent.stopPropagation();

            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            document.body.appendChild(overlay);

            const popup = document.createElement('div');
            popup.className = 'user-popup active modal-centered';

            const title = document.createElement('div');
            title.className = 'popup-title';
            title.textContent = `${feature.name} - Assigned Users`;

            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-popup';
            closeBtn.innerHTML = '×';
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                popup.remove();
                overlay.remove();
            };

            const userList = document.createElement('ul');
            userList.className = 'user-list';

            if (feature.assigned_users.length > 0) {
                feature.assigned_users.forEach(user => {
                    const userItem = document.createElement('li');
                    userItem.className = 'user-list-item';
                    userItem.textContent = user;
                    userList.appendChild(userItem);
                });
            } else {
                const noUsers = document.createElement('li');
                noUsers.className = 'user-list-item';
                noUsers.textContent = 'No users assigned';
                userList.appendChild(noUsers);
            }

            popup.appendChild(closeBtn);
            popup.appendChild(title);
            popup.appendChild(userList);

            document.body.appendChild(popup);
            currentPopup = popup;

            // Close popup when clicking outside
            const closePopupHandler = (e) => {
                if (!popup.contains(e.target) && !e.target.closest('.feature-item')) {
                    popup.remove();
                    overlay.remove();
                    document.removeEventListener('click', closePopupHandler);
                }
            };

            // Delay adding the click listener to prevent immediate closure
            setTimeout(() => {
                document.addEventListener('click', closePopupHandler);
            }, 0);
        }

        data.phases.forEach((phase, index) => {
            const phaseElement = document.createElement("div");
            phaseElement.className = `phase ${phase.current ? "current-phase" : ""}`;

            // Create phase title
            const phaseTitle = document.createElement("h2");
            phaseTitle.className = "phase-title";
            phaseTitle.textContent = `Phase ${phase.name}`;
            phaseElement.appendChild(phaseTitle);

            // Create features container
            const featuresContainer = document.createElement("div");
            featuresContainer.className = "features-container";

            // Calculate phase progress
            const completedFeatures = phase.features.filter(
                (f) => f.status === "completed"
            ).length;
            const progressPercentage =
                (completedFeatures / phase.features.length) * 100;

            // Add features
            phase.features.forEach((feature) => {
                const featureItem = document.createElement("div");
                featureItem.className = "feature-item";
                featureItem.style.cursor = "pointer";
                featureItem.onclick = (e) => createUserPopup(feature, e);

                const featureInfo = document.createElement("div");
                featureInfo.className = "feature-info";

                // Feature name with optional NEW badge
                const featureName = document.createElement("div");
                featureName.className = "feature-name";
                featureName.textContent = feature.name;

                if (feature.new) {
                    const newBadge = document.createElement("span");
                    newBadge.className = "new-badge";
                    newBadge.textContent = "NEW";
                    featureName.appendChild(newBadge);
                }

                // Assigned users
                const assignedUsers = document.createElement("div");
                assignedUsers.className = "assigned-users";
                assignedUsers.textContent = `${feature.assigned_users.length}/${feature.user_limit} users`;

                if (feature.assigned_users.length >= feature.user_limit) {
                    const capacityBadge = document.createElement("span");
                    capacityBadge.className = "capacity-full";
                    capacityBadge.textContent = "FULL";
                    assignedUsers.appendChild(capacityBadge);
                }

                // Status badge
                const statusBadge = document.createElement("div");
                statusBadge.className = `feature-status status-${feature.status}`;
                statusBadge.textContent =
                    feature.status.charAt(0).toUpperCase() + feature.status.slice(1);

                featureInfo.appendChild(featureName);
                featureInfo.appendChild(assignedUsers);
                featureItem.appendChild(featureInfo);
                featureItem.appendChild(statusBadge);
                featuresContainer.appendChild(featureItem);
            });

            // Add progress bar
            const progressBar = document.createElement("div");
            progressBar.className = "progress-bar";

            const progressFill = document.createElement("div");
            progressFill.className = "progress-fill";
            progressFill.style.width = `${progressPercentage}%`;

            const progressText = document.createElement("div");
            progressText.className = "progress-text";
            progressText.innerHTML = `
                    <span>Progress</span>
                    <span class="progress-number">${progressPercentage.toFixed(
                        0
                    )}%</span>
                `;

            progressBar.appendChild(progressFill);
            phaseElement.appendChild(featuresContainer);
            phaseElement.appendChild(progressBar);
            phaseElement.appendChild(progressText);

            roadmapContainer.appendChild(phaseElement);

            // Add separator between phases (except for the last phase)
            if (index < data.phases.length - 1) {
                const separator = document.createElement("div");
                separator.className = "phase-separator";
                roadmapContainer.appendChild(separator);
            }
        });
    } catch (error) {
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.innerHTML = `
                <h3>Error loading roadmap data</h3>
                <pre>${error.message}</pre>
            `;
        document.getElementById("roadmap-container").appendChild(errorMessage);
    }
});
