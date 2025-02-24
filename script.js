async function loadRoadmapData() {
    const response = await fetch('data.yml');
    const yamlText = await response.text();
    return jsyaml.load(yamlText);
}

function calculatePhaseProgress(features) {
    const total = features.length;
    const completed = features.filter(f => f.status === 'completed').length;
    const inProgress = features.filter(f => f.status === 'in-progress').length;
    return {
        percent: Math.round((completed + inProgress * 0.5) / total * 100),
        completed,
        inProgress
    };
}

async function renderRoadmap() {
    const data = await loadRoadmapData();
    const container = document.getElementById('roadmap-container');

    data.phases.forEach(phase => {
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
            <span class="progress-number">${progress.percent}%</span>
        `;
        
        progressBar.appendChild(progressFill);
        phaseElement.appendChild(progressBar);
        phaseElement.appendChild(progressText);

        const featureList = document.createElement('ul');
        featureList.className = 'feature-list';

        phase.features.forEach(feature => {
            const featureItem = document.createElement('li');
            featureItem.className = 'feature-item';

            const featureInfo = document.createElement('div');
            featureInfo.className = 'feature-info';

            const featureName = document.createElement('span');
            featureName.className = 'feature-name';
            featureName.textContent = feature.name;

            const assignedUsers = document.createElement('div');
            assignedUsers.className = 'assigned-users';
            assignedUsers.innerHTML = `<strong>Asignado a:</strong> ${feature.assigned_users.length > 0 ? feature.assigned_users.join(', ') : 'No hay usuarios asignados'}`;

            featureInfo.appendChild(featureName);
            featureInfo.appendChild(assignedUsers);

            const featureStatus = document.createElement('span');
            featureStatus.className = `feature-status status-${feature.status}`;
            featureStatus.textContent = feature.status === 'completed' ? 'Completado' :
                                      feature.status === 'in-progress' ? 'En Progreso' : 'Pendiente';

            featureItem.appendChild(featureInfo);
            featureItem.appendChild(featureStatus);
            featureList.appendChild(featureItem);
        });

        phaseElement.appendChild(titleElement);
        phaseElement.appendChild(progressBar);
        phaseElement.appendChild(featureList);
        container.appendChild(phaseElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderRoadmap();
    
    // Create light cursor element
    const lightCursor = document.createElement('div');
    lightCursor.className = 'light-cursor';
    document.body.appendChild(lightCursor);
    
    // Update light cursor position
    document.addEventListener('mousemove', (e) => {
        lightCursor.style.left = e.clientX + 'px';
        lightCursor.style.top = e.clientY + 'px';
    });
});