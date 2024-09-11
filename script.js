    let tableCount = 1;

    // Add new table field
    function addTable() {
      tableCount++;
      const tableFieldHtml = `
        <div class="mb-3" id="tableField${tableCount}">
          <label for="tableName${tableCount}" class="form-label">Table Name</label>
          <input type="text" class="form-control table-name" id="tableName${tableCount}" placeholder="Enter table name">
          <div class="invalid-feedback" id="tableNameError${tableCount}">Table Name is required</div>
        </div>
      `;
      document.getElementById('tableFields').insertAdjacentHTML('beforeend', tableFieldHtml);
    }

    // Handle creating the user and grant queries
    function handleGenerateUserQuery() {
      if (validateInputs()) {
        const username = document.getElementById('username').value;
        const serverIp = document.getElementById('serverIp').value;
        const newPassword = generatePassword();

        const query = `
          CREATE USER '${username}'@'${serverIp}' IDENTIFIED BY '${newPassword}';
        `;

        displayQuery(query);
      }
    }

    // Handle generating only the grant queries
    function handleGenerateGrantQuery() {
      if (validateInputs()) {
        const username = document.getElementById('username').value;
        const serverIp = document.getElementById('serverIp').value;
        const dbName = document.getElementById('dbName').value;
        const privilege = document.getElementById('privilege').value;

        let grantQueries = '';
        for (let i = 1; i <= tableCount; i++) {
          const tableName = document.getElementById(`tableName${i}`).value;
          if (tableName) {
            grantQueries += `
              GRANT ${privilege} ON ${dbName}.${tableName} TO '${username}'@'${serverIp}';
            `;
          }
        }

        displayQuery(grantQueries.trim());
      }
    }

    // Validate inputs
    function validateInputs() {
      let hasError = false;

      const username = document.getElementById('username').value;
      const serverIp = document.getElementById('serverIp').value;
      const dbName = document.getElementById('dbName').value;
      const privilege = document.getElementById('privilege').value;

      if (!username) {
        showError('usernameError');
        hasError = true;
      } else {
        hideError('usernameError');
      }

      if (!serverIp) {
        showError('serverIpError');
        hasError = true;
      } else {
        hideError('serverIpError');
      }

      if (!dbName) {
        showError('dbNameError');
        hasError = true;
      } else {
        hideError('dbNameError');
      }

      for (let i = 1; i <= tableCount; i++) {
        const tableName = document.getElementById(`tableName${i}`).value;
        if (!tableName) {
          showError(`tableNameError${i}`);
          hasError = true;
        } else {
          hideError(`tableNameError${i}`);
        }
      }

      if (!privilege) {
        showError('privilegeError');
        hasError = true;
      } else {
        hideError('privilegeError');
      }

      return !hasError;
    }

    // Display the generated query
    function displayQuery(query) {
      document.getElementById('generatedQuery').innerText = query.trim();
      document.getElementById('generatedQueryContainer').style.display = 'block';
    }

    // Generate random password
    function generatePassword(length = 16) {
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let password = '';

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }

      return password;
    }

    // Show validation error
    function showError(elementId) {
      const element = document.getElementById(elementId);
      element.style.display = 'block';
      document.getElementById(elementId.replace('Error', '')).classList.add('is-invalid');
    }

    // Hide validation error
    function hideError(elementId) {
      const element = document.getElementById(elementId);
      element.style.display = 'none';
      document.getElementById(elementId.replace('Error', '')).classList.remove('is-invalid');
    }

    // Handle sending to ots.fyi
    async function sendToOtsFyi() {
  const sendBtn = document.getElementById('sendBtn');
  sendBtn.disabled = true;
  sendBtn.innerText = 'Sending...';

  const username = document.getElementById('username').value;
  const password = generatePassword();

  try {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Public CORS Anywhere proxy
    const targetUrl = 'https://ots.fyi/api/create';

    const response = await axios.post(proxyUrl + targetUrl, {
      secret: `Username: ${username}, Password: ${password}`
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.data && response.data.secret_id) {
      const secretUrl = `https://ots.fyi/#${response.data.secret_id}`;
      document.getElementById('secretUrl').innerText = secretUrl;
      document.getElementById('secretUrl').href = secretUrl;
      document.getElementById('secretUrlContainer').style.display = 'block';
    } else {
      console.error('Error: Invalid response from ots.fyi');
    }
  } catch (error) {
    console.error('Error sending to ots.fyi:', error);
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerText = 'Send To Ots';
  }
}


    // Copy text to clipboard
    function copyToClipboard(elementId) {
      const text = document.getElementById(elementId).innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          alert('Copied to clipboard!');
        }).catch(err => {
          console.error('Could not copy text: ', err);
          alert('Failed to copy to clipboard.');
        });
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          alert('Copied to clipboard!');
        } catch (err) {
          console.error('Could not copy text: ', err);
          alert('Failed to copy to clipboard.');
        }
        document.body.removeChild(textarea);
      }
    }
