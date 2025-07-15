document.getElementById("uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const files = document.getElementById("jsonFile").files;
  if (files.length !== 2) {
    document.getElementById("output").innerText =
      "Upload 2 file: followers dan following!";
    return;
  }

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          resolve(JSON.parse(event.target.result));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  Promise.all([readFile(files[0]), readFile(files[1])])
    .then(([followersRaw, followingRaw]) => {
      // Ekstrak followers
      const followers = followersRaw.reduce((acc, item) => {
        if (Array.isArray(item.string_list_data)) {
          item.string_list_data.forEach((data) => {
            if (data.value) acc.push(data.value);
          });
        }
        return acc;
      }, []);

      // Ekstrak following sesuai format default
      let following = [];
      if (
        followingRaw.relationships_following &&
        Array.isArray(followingRaw.relationships_following)
      ) {
        followingRaw.relationships_following.forEach((item) => {
          if (Array.isArray(item.string_list_data)) {
            item.string_list_data.forEach((data) => {
              if (data.value) following.push(data.value);
            });
          }
        });
      }

      // Set untuk pencarian cepat
      const followersSet = new Set(followers);
      const followingSet = new Set(following);

      // Siapa yang kita follow tapi tidak follow balik
      const notFollback = following.filter((u) => !followersSet.has(u));
      // Siapa yang follow kita tapi kita tidak follow balik
      const notFollowedBack = followers.filter((u) => !followingSet.has(u));

      // Build HTML for "Tidak Follback" section
      let notFollbackHTML = `<ul class="space-y-2">`;
      notFollback.forEach((u) => {
        notFollbackHTML += `<li><a href="https://www.instagram.com/${u}" target="_blank" rel="noopener" class="text-blue-600 hover:text-blue-800 underline">@${u}</a></li>`;
      });
      notFollbackHTML += `</ul>`;

      // Build HTML for "Kamu Tidak Follback" section
      let notFollowedBackHTML = `<ul class="space-y-2">`;
      notFollowedBack.forEach((u) => {
        notFollowedBackHTML += `<li><a href="https://www.instagram.com/${u}" target="_blank" rel="noopener" class="text-blue-600 hover:text-blue-800 underline">@${u}</a></li>`;
      });
      notFollowedBackHTML += `</ul>`;

      // Insert the HTML into their respective containers
      document.getElementById("notFollback").innerHTML += notFollbackHTML;
      document.getElementById("notFollowedBack").innerHTML += notFollowedBackHTML;
    })
    .catch((err) => {
      console.error("Error:", err);
      document.getElementById("output").innerText = "Gagal membaca file JSON!";
    });
});
