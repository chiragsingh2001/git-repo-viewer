document.addEventListener('DOMContentLoaded', function () {
  const username = 'freeCodeCamp';
  const apiUrl = `https://api.github.com/users/${username}`;
  const perPageSelect = document.getElementById('perPageSelect');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const currentPageSpan = document.getElementById('currentPage');
  const repositoriesSection = document.getElementById('repositories-section');

  let currentPage = 1;
  let repositoriesPerPage = 10;

  function fetchRepositories(page, perPage) {
      const reposUrl = `${apiUrl}/repos?page=${page}&per_page=${perPage}`;

      fetch(reposUrl)
          .then(response => response.json())
          .then(data => {
              repositoriesSection.innerHTML = '<h2>Repositories</h2>';
              data.forEach(repository => {
                  repositoriesSection.innerHTML += `
                      <div class="repository">
                          <h3><a href="${repository.html_url}" target="_blank">${repository.name}</a></h3>
                          <p>${repository.description || 'No description available'}</p>
                          <p>Language: ${repository.language || 'N/A'}</p>
                      </div>
                  `;
              });

              updatePaginationButtons(page, data.length);
          })
          .catch(error => console.error('Error fetching repositories:', error));
  }

  function updatePaginationButtons(page, reposCount) {
      prevBtn.disabled = page === 1;
      nextBtn.disabled = reposCount < repositoriesPerPage;
      currentPageSpan.innerText = page;
  }

  function nextPage() {
      currentPage++;
      fetchRepositories(currentPage, repositoriesPerPage);
  }

  function prevPage() {
      if (currentPage > 1) {
          currentPage--;
          fetchRepositories(currentPage, repositoriesPerPage);
      }
  }

  function changePerPage() {
      repositoriesPerPage = parseInt(perPageSelect.value);
      currentPage = 1; // Reset to the first page when changing the number of repositories per page
      fetchRepositories(currentPage, repositoriesPerPage);
  }

  // Fetch and display user profile
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json();
      })
      .then(data => {
          const profileSection = document.getElementById('profile-section');
          profileSection.innerHTML = `
              <img src=${data.avatar_url}>
              <h2>${data.name}</h2>
              <p>${data.bio}</p>
              <p>Followers: ${data.followers}</p>
              <p>Following: ${data.following}</p>
          `;
      });

  // Initial fetch for the first page
  fetchRepositories(currentPage, repositoriesPerPage);

  // Event listeners for pagination buttons
  nextBtn.addEventListener('click', function () {
      nextPage();
  });

  prevBtn.addEventListener('click', function () {
      prevPage();
  });

  perPageSelect.addEventListener('change', function () {
      changePerPage();
  });
});
