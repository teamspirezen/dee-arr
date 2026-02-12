document.addEventListener('DOMContentLoaded', () => {
    const projectGrid = document.getElementById('projects-grid');
    const uploadForm = document.getElementById('upload-form');

    // Load Projects (for index.html)
    if (projectGrid) {
        fetchProjects();
    }

    // Handle Upload (for admin.html)
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }

    async function fetchProjects() {
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();

            projectGrid.innerHTML = '';

            if (data.projects.length === 0) {
                projectGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No projects found.</p>';
                return;
            }

            data.projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'glass-card project-card';

                const imageHtml = project.image_path
                    ? `<img src="${project.image_path}" alt="${project.title}">`
                    : '<div style="height:200px; background:rgba(0,0,0,0.2); border-radius:0.5rem; margin-bottom:1rem; display:flex; align-items:center; justify-content:center;">No Image</div>';

                const docLink = project.document_path
                    ? `<a href="${project.document_path}" target="_blank" class="btn-link">📄 View Document</a>`
                    : '';

                const zipLink = project.zip_path
                    ? `<a href="${project.zip_path}" download class="btn-link">📦 Download Assets</a>`
                    : '';

                card.innerHTML = `
                    ${imageHtml}
                    <h3>${project.title}</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem;">${project.description}</p>
                    <div class="project-links">
                        ${docLink}
                        ${zipLink}
                    </div>
                `;
                projectGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    async function handleUpload(e) {
        e.preventDefault();

        const submitBtn = uploadForm.querySelector('button');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Uploading...';
        submitBtn.disabled = true;

        const formData = new FormData(uploadForm);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert('Submission received successfully!');
                uploadForm.reset();
            } else {
                alert('Upload failed: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            alert('Error during upload: ' + error.message);
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    }
});
