// feedback.js - Formspree integration for feedback modal
document.addEventListener('DOMContentLoaded', function() {
    console.log('Feedback script loaded');
    
    // Get modal elements
    const openBtn = document.getElementById('openFeedbackBtn');
    const closeBtn = document.getElementById('closeFeedbackBtn');
    const modal = document.getElementById('feedbackModal');
    const form = document.getElementById('feedbackForm');
    
    // Check if elements exist
    if (!openBtn || !closeBtn || !modal || !form) {
        console.error('Required feedback elements not found!');
        return;
    }
    
    // Open modal when feedback button is clicked
    openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Opening feedback modal');
        modal.classList.add('active');
    });
    
    // Close modal when close button is clicked
    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Closing feedback modal');
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside the form
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            console.log('Clicked outside form, closing modal');
            modal.classList.remove('active');
        }
    });
    
    // Handle form submission to Formspree
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submission started');
        
        // Get form data
        const formData = new FormData();
        formData.append('issueType', document.getElementById('issueType').value);
        formData.append('bugSummary', document.getElementById('bugSummary').value);
        formData.append('details', document.getElementById('details').value);
        formData.append('email', document.getElementById('email').value);
        
        console.log('Submitting data to Formspree');
        
        // Disable submit button during submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            // Submit to Formspree using FormData (recommended for Formspree)
            const response = await fetch('https://formspree.io/f/xkgzwryb', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('Form submitted successfully');
                // Reset form and close modal
                form.reset();
                modal.classList.remove('active');
                alert('Thank you for your feedback! We have received your message.');
            } else {
                console.error('Form submission failed:', response.status);
                const errorData = await response.json();
                throw new Error(errorData.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your feedback. Please try again later.');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
