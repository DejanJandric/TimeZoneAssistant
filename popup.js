document.addEventListener('DOMContentLoaded', function() {
  console.log('Popup script loaded');
  
  const timezone1Select = document.getElementById('timezone1');
  const timezone2Select = document.getElementById('timezone2');
  const time1Display = document.getElementById('time1');
  const time2Display = document.getElementById('time2');

  // Check if elements exist
  if (!timezone1Select || !timezone2Select || !time1Display || !time2Display) {
    console.error('Required timezone elements not found!');
    return;
  }

  // Get a list of all IANA time zones
  const timezones = Intl.supportedValuesOf('timeZone');
  console.log('Found', timezones.length, 'timezones');

  // Populate the dropdowns with time zones
  timezones.forEach(zone => {
    const option1 = document.createElement('option');
    option1.value = zone;
    option1.textContent = zone;
    timezone1Select.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = zone;
    option2.textContent = zone;
    timezone2Select.appendChild(option2);
  });

  // Function to update the displayed times
  function updateTimes() {
    try {
      const now = new Date();
      const tz1 = timezone1Select.value;
      const tz2 = timezone2Select.value;

      if (tz1 && tz2) {
        const options1 = { timeStyle: 'medium', hour12: true, timeZone: tz1 };
        time1Display.textContent = now.toLocaleTimeString('en-US', options1);

        const options2 = { timeStyle: 'medium', hour12: true, timeZone: tz2 };
        time2Display.textContent = now.toLocaleTimeString('en-US', options2);
        
        // Save the selected time zones
        chrome.storage.sync.set({
            timezone1: tz1,
            timezone2: tz2
        });
      }
    } catch (error) {
      console.error('Error updating times:', error);
    }
  }

  // Load saved time zones and set initial values
  chrome.storage.sync.get(['timezone1', 'timezone2'], function(result) {
    try {
      if (result.timezone1 && timezones.includes(result.timezone1)) {
        timezone1Select.value = result.timezone1;
      } else {
        // Default to user's local timezone
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        timezone1Select.value = localTz;
      }
      
      if (result.timezone2 && timezones.includes(result.timezone2)) {
        timezone2Select.value = result.timezone2;
      } else {
        // Default to a common timezone
        timezone2Select.value = 'America/New_York';
      }
      
      // Initial time update and set interval to update every second
      updateTimes();
      setInterval(updateTimes, 1000);
    } catch (error) {
      console.error('Error loading saved timezones:', error);
      // Set defaults if there's an error
      timezone1Select.value = 'America/New_York';
      timezone2Select.value = 'Europe/London';
      updateTimes();
      setInterval(updateTimes, 1000);
    }
  });

  // Update times when a new time zone is selected
  timezone1Select.addEventListener('change', updateTimes);
  timezone2Select.addEventListener('change', updateTimes);

  // Calendly button functionality
  const calendlyBtn = document.getElementById('calendlyBtn');
  if (calendlyBtn) {
    calendlyBtn.addEventListener('click', function() {
      // Replace 'your-calendly-username' with your actual Calendly username
      const calendlyUrl = 'https://calendly.com/your-calendly-username/15min';
      chrome.tabs.create({ url: calendlyUrl });
    });
  }
});
