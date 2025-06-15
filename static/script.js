const apiBaseUrl = "http://localhost:8000";

// Получение списка пользователей
async function fetchUsers() {
  try {
    const response = await fetch(`${apiBaseUrl}/users`);
    if (!response.ok) throw new Error("Ошибка загрузки");
    const data = await response.json();
    renderUsers(data);
  } catch (err) {
    console.error("Ошибка:", err.message);
  }
}

// Отображение пользователей
function renderUsers(users) {
  const listEl = document.querySelector("#user-list");
  listEl.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `${user.id}: ${user.username}`;
    listEl.appendChild(li);
  });
}

// Авторизация
document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert("Логин выполнен успешно!");
      fetchUsers();
    } else {
      alert("Неверные данные для входа.");
    }
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
});

// Создание пользователя
document.getElementById("create-user-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  let body = {};
  for (let [key, value] of formData.entries()) {
    if (value) {
      body[key] = value;
    }
  }

  try {
    const response = await fetch(`${apiBaseUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 201) {
      alert("Пользователь успешно создан!");
      fetchUsers();
    } else {
      const errorData = await response.json();
      console.error("Ошибка создания пользователя:", errorData);

      if (response.status === 422 && Array.isArray(errorData.detail)) {
        const messages = errorData.detail.map((err) => {
          const field = err.loc?.[err.loc.length - 1];
          return `${field}: ${err.msg}`;
        }).join("\n");
        alert(`Ошибка валидации:\n${messages}`);
      } else {
        alert(`Ошибка создания пользователя (${response.status}): ${errorData.detail || "Неизвестная ошибка"}`);
      }
    }
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
});

// Обновление пользователя
document.getElementById("update-user-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const userId = formData.get("update-user-id");

  let body = {};
  for (let [key, value] of formData.entries()) {
    if (value && key !== "update-user-id") {
      body[key.replace("update-", "")] = value;
    }
  }

  try {
      const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      alert("Пользователь успешно обновлён!");
      fetchUsers();
    } else {
      alert(`Ошибка обновления пользователя (${response.status})`);
    }
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
});

// Удаление пользователя
document.getElementById("delete-user-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const userId = formData.get("delete-user-id");

  try {
    const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
      method: "DELETE",
    });

    if (response.status === 200) {
      alert("Пользователь успешно удалён!");
      fetchUsers();
    } else {
      alert(`Ошибка удаления пользователя (${response.status})`);
    }
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
});

// Получение данных пользователя по ID
document.getElementById("get-user-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userId = document.getElementById("get-user-id").value;

  try {
    const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const userData = await response.json();
      alert(`User Data:\n${JSON.stringify(userData, null, 2)}`);
    } else {
      const errorData = await response.json();
      alert(`Ошибка получения данных пользователя (${response.status}): ${errorData.detail || "Неизвестная ошибка"}`);
    }
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
});


// Загрузка пользователей при старте
fetchUsers();
