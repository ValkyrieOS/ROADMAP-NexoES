async function loadRoadmapData() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'data.yml', true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const yamlText = xhr.responseText;
                    if (!yamlText) {
                        throw new Error('YAML file is empty');
                    }
                    
                    const data = jsyaml.load(yamlText);
                    if (!data) {
                        throw new Error('Failed to parse YAML data');
                    }
                    
                    if (!data.phases || !Array.isArray(data.phases)) {
                        throw new Error('Invalid YAML structure: phases must be an array');
                    }
                    
                    // Validate each phase structure
                    data.phases.forEach((phase, index) => {
                        if (!phase.name) {
                            throw new Error(`Phase at index ${index} is missing name property`);
                        }
                        if (!phase.features || !Array.isArray(phase.features)) {
                            throw new Error(`Phase "${phase.name}" has invalid features structure`);
                        }
                        
                        // Validate each feature
                        phase.features.forEach((feature, featureIndex) => {
                            if (!feature.name) {
                                throw new Error(`Feature at index ${featureIndex} in phase "${phase.name}" is missing name`);
                            }
                            if (!feature.status) {
                                throw new Error(`Feature "${feature.name}" is missing status`);
                            }
                            if (!Array.isArray(feature.assigned_users)) {
                                throw new Error(`Feature "${feature.name}" has invalid assigned_users structure`);
                            }
                            if (typeof feature.user_limit !== 'number') {
                                throw new Error(`Feature "${feature.name}" has invalid user_limit`);
                            }
                        });
                    });
                    
                    console.log('YAML data validated successfully:', data);
                    resolve(data);
                } catch (error) {
                    console.error('YAML parsing/validation error:', error);
                    reject(error);
                }
            } else {
                console.error(`HTTP Status: ${xhr.status}, Response: ${xhr.responseText}`);
                reject(new Error(`HTTP error! status: ${xhr.status}`));
            }
        };
        
        xhr.onerror = function(e) {
            console.error('Network error details:', e);
            reject(new Error('Network error while fetching YAML file'));
        };
        
        xhr.ontimeout = function() {
            reject(new Error('Request timeout while fetching YAML file'));
        };
        
        xhr.send();
    });
}

function calculatePhaseProgress(features) {
    try {
        if (!Array.isArray(features)) {
            throw new Error('Features must be an array');
        }
        
        const total = features.length;
        if (total === 0) {
            throw new Error('Features array is empty');
        }
        
        const completed = features.filter(f => f.status === 'completed').length;
        const inProgress = features.filter(f => f.status === 'in-progress').length;
        
        const percent = Math.round((completed + inProgress * 0.5) / total * 100);
        
        console.log('Progress calculation:', {
            total,
            completed,
            inProgress,
            percent
        });
        
        return { percent, completed, inProgress };
    } catch (error) {
        console.error('Error calculating phase progress:', error);
        return { percent: 0, completed: 0, inProgress: 0 };
    }
}

async function renderRoadmap() {
    try {
        const data = await loadRoadmapData();
        console.log('Starting roadmap rendering with data:', data);
        
        const container = document.getElementById('roadmap-container');
        if (!container) {
            throw new Error('Roadmap container element not found in DOM');
        }
        
        container.innerHTML = '';
        
        data.phases.forEach((phase, phaseIndex) => {
            try {
                console.log(`Rendering phase ${phase.name}`);
                
                const progress = calculatePhaseProgress(phase.features);
                const phaseElement = document.createElement('div');
                phaseElement.className = `phase ${phase.current ? 'current-phase' : ''} ${progress.percent === 0 ? 'phase-pending' : ''}`;
                
                const titleElement = document.createElement('h2');
                titleElement.className = 'phase-title';
                titleElement.textContent = `Fase ${phase.name}`;
                
                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                const progressFill = document.createElement('div');
                progressFill.className = 'progress-fill';
                progressFill.style.width = `${progress.percent}%`;
                
                const progressText = document.createElement('div');
                progressText.className = 'progress-text';
                progressText.innerHTML = `
                    <span>Progreso</span>
                    <span>Progreso</span>
                    <span class="progress-number">${progress.percent}%</span>
                `;
                
                progressBar.appendChild(progressFill);
                phaseElement.appendChild(titleElement);
                phaseElement.appendChild(progressBar);
                phaseElement.appendChild(progressText);
                
                const featureList = document.createElement('ul');
                featureList.className = 'feature-list';
                
                phase.features.forEach((feature, featureIndex) => {
                    try {
                        console.log(`Rendering feature "${feature.name}" in phase ${phase.name}`);
                        
                        const featureItem = document.createElement('li');
                        featureItem.className = 'feature-item';
                        
                        const featureInfo = document.createElement('div');
                        featureInfo.className = 'feature-info';
                        
                        const featureName = document.createElement('span');
                        featureName.className = 'feature-name';
                        featureName.textContent = feature.name;
                        
                        if (feature.new) {
                            const newBadge = document.createElement('span');
                            newBadge.className = 'new-badge';
                            newBadge.textContent = 'NEW';
                            featureInfo.appendChild(featureName);
                            featureInfo.appendChild(newBadge);
                        } else {
                            featureInfo.appendChild(featureName);
                        }
                        
                        const assignedUsers = document.createElement('div');
                        assignedUsers.className = 'assigned-users';
                        const capacityStatus = feature.assigned_users.length >= feature.user_limit ? '<span class="capacity-full">Capacidad llena</span>' : '';
                        assignedUsers.innerHTML = `<strong>Asignado a:</strong> ${feature.assigned_users.length > 0 ? feature.assigned_users.join(', ') : 'No hay usuarios asignados'} <span class="user-limit">(${feature.assigned_users.length}/${feature.user_limit})</span> ${capacityStatus}`;
                        
                        // Remove this line as we already added featureName above
                        // featureInfo.appendChild(featureName);
                        featureInfo.appendChild(assignedUsers);
                        
                        const featureStatus = document.createElement('span');
                        featureStatus.className = `feature-status status-${feature.status}`;
                        featureStatus.textContent = feature.status === 'completed' ? 'Completado' :
                                                  feature.status === 'in-progress' ? 'En Progreso' : 'Pendiente';
                        
                        featureItem.appendChild(featureInfo);
                        featureItem.appendChild(featureStatus);
                        featureList.appendChild(featureItem);
                    } catch (featureError) {
                        console.error(`Error rendering feature ${featureIndex} in phase ${phase.name}:`, featureError);
                        const errorItem = document.createElement('li');
                        errorItem.className = 'feature-error';
                        errorItem.textContent = `Error rendering feature: ${featureError.message}`;
                        featureList.appendChild(errorItem);
                    }
                });
                
            } catch (phaseError) {
                console.error(`Error rendering phase ${phaseIndex}:`, phaseError);
                const errorPhase = document.createElement('div');
                errorPhase.className = 'phase-error';
                errorPhase.textContent = `Error rendering phase: ${phaseError.message}`;
                container.appendChild(errorPhase);
            }
        });
        
    } catch (error) {
        console.error('Critical error rendering roadmap:', error);
        const container = document.getElementById('roadmap-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>Error loading roadmap data</h3>
                    <p>${error.message}</p>
                    <pre>${error.stack}</pre>
                </div>`;
        }
    }
}

// Add error handling for the initial load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded, initializing roadmap...');
    renderRoadmap().catch(error => {
        console.error('Failed to initialize roadmap:', error);
    });
});