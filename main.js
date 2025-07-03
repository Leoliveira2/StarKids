// main.js (COMPLETO)

// ================= ESTADO GLOBAL =================
let appState = {
  currentUser: null,
  users: [],
  activities: [],
  showLogin: true,
  showAddActivity: false,
  showEditActivities: false,
  isLoading: false,
  lastUpdate: Date.now(),
  showDashboardTab: 'hoje'
};

let loginForm = {
  name: '',
  type: 'child',
  mascot: 'star'
};

let activityForm = {
  name: '',
  description: '',
  points: 10,
  targetUserId: '',
  category: 'geral'
};

const defaultActivities = [
  { name: 'Dormir no horário', description: 'Ir para a cama no horário combinado', points: 15, category: 'saúde' },
  { name: 'Escovar os dentes', description: 'Escovação completa manhã e noite', points: 10, category: 'higiene' },
  { name: 'Fazer o dever de casa', description: 'Completar todas as tarefas escolares', points: 20, category: 'educação' },
  { name: 'Ler por 15 minutos', description: 'Momento de leitura diária', points: 15, category: 'educação' },
  { name: 'Organizar o quarto', description: 'Guardar brinquedos e organizar espaço', points: 10, category: 'responsabilidade' },
  { name: 'Tomar banho', description: 'Higiene pessoal completa', points: 10, category: 'higiene' },
  { name: 'Comer frutas/verduras', description: 'Alimentação saudável', points: 10, category: 'alimentação' },
  { name: 'Ajudar em casa', description: 'Colaborar com as tarefas domésticas', points: 15, category: 'responsabilidade' }
];

// ================= LOCAL STORAGE =================
function saveToLocalStorage() {
  try {
    localStorage.setItem('superkids-data', JSON.stringify({
      users: appState.users,
      activities: appState.activities,
      lastUpdate: appState.lastUpdate,
      version: '3.0'
    }));
  } catch (e) {
    console.error('Erro ao salvar:', e);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('superkids-data');
    if (saved) {
      const data = JSON.parse(saved);
      appState.users = data.users || [];
      appState.activities = data.activities || [];
      appState.lastUpdate = data.lastUpdate || Date.now();
    }
  } catch (e) {
    console.error('Erro ao carregar:', e);
  }
}

// ================= LOGIN =================
function handleLogin() {
  if (!loginForm.name.trim()) return;
  const existingUser = appState.users.find(u => u.name.toLowerCase().trim() === loginForm.name.toLowerCase().trim());
  if (existingUser) {
    appState.currentUser = existingUser;
  } else {
    const newUser = {
      id: Date.now(),
      name: loginForm.name.trim(),
      type: loginForm.type,
      xp: 0,
      mascot: loginForm.mascot,
      achievements: [],
      createdAt: new Date().toISOString(),
      streak: 0,
      totalActivities: 0
    };
    appState.users.push(newUser);
    appState.currentUser = newUser;
    if (newUser.type === 'child') {
      const defaultActivitiesForChild = defaultActivities.map((activity, index) => ({
        id: Date.now() + index,
        userId: newUser.id,
        name: activity.name,
        description: activity.description,
        points: activity.points,
        category: activity.category,
        status: 'pending',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isDefault: true
      }));
      appState.activities.push(...defaultActivitiesForChild);
    }
  }
  appState.showLogin = false;
  saveToLocalStorage();
  render();
}

function selectUserType(type) {
  loginForm.type = type;
  render();
}

function selectMascot(mascot) {
  loginForm.mascot = mascot;
  render();
}

function logout() {
  appState.currentUser = null;
  appState.showLogin = true;
  loginForm = { name: '', type: 'child', mascot: 'star' };
  render();
}

// ================= RENDER PRINCIPAL =================
function render() {
  const container = document.getElementById('app');
  if (!container) return;
  container.innerHTML = appState.showLogin ? renderLoginScreen() : appState.currentUser.type === 'child' ? renderChildDashboard() : renderParentDashboard();
}

// ================= RENDER LOGIN =================
function renderLoginScreen() {
  return `
    <div class="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-xl text-center">
      <h1 class="text-3xl font-bold mb-4">SuperKids</h1>
      <input type="text" placeholder="Seu nome" value="${loginForm.name}" onchange="loginForm.name = this.value" class="border rounded p-2 mb-4 w-full" />
      <div class="mb-4">
        <button onclick="selectUserType('child')" class="px-4 py-2 ${loginForm.type === 'child' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded">Criança</button>
        <button onclick="selectUserType('parent')" class="px-4 py-2 ${loginForm.type === 'parent' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded ml-2">Responsável</button>
      </div>
      <div class="mb-4">
        ${Object.entries(mascots).map(([key, mascot]) => `
          <button onclick="selectMascot('${key}')" class="text-2xl mx-1 ${loginForm.mascot === key ? 'border-2 border-blue-500 rounded' : ''}">${mascot.emoji}</button>
        `).join('')}
      </div>
      <button onclick="handleLogin()" class="bg-green-500 text-white px-4 py-2 rounded">Entrar</button>
    </div>
  `;
}

// ================= RENDER DASHBOARD CRIANÇA =================
function renderChildDashboard() {
  const user = appState.currentUser;
  const mascot = mascots[user.mascot];
  const today = new Date().toISOString().split('T')[0];
  const activities = appState.activities.filter(act => act.userId === user.id && act.date.startsWith(today));

  return `
    <div class="text-center text-white">
      <h2 class="text-2xl font-bold mb-2">Olá, ${user.name}!</h2>
      <p class="text-xl mb-4">Mascote: ${mascot.emoji} ${mascot.name}</p>
      <p class="mb-4">XP: ${user.xp}</p>
      <div class="grid gap-4">
        ${activities.map(act => `
          <div class="bg-white text-gray-800 p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <h3 class="font-bold">${act.name}</h3>
              <p class="text-sm">${act.description}</p>
            </div>
            <button onclick="completeActivity(${act.id})" class="bg-green-500 text-white px-4 py-2 rounded-xl">Concluir</button>
          </div>
        `).join('')}
      </div>
      <button onclick="logout()" class="mt-6 bg-red-500 px-4 py-2 rounded">Sair</button>
    </div>
  `;
}

function completeActivity(id) {
  const activity = appState.activities.find(a => a.id === id);
  if (activity && activity.status === 'pending') {
    activity.status = 'done';
    const user = appState.users.find(u => u.id === activity.userId);
    user.xp += activity.points;
    user.totalActivities += 1;
    saveToLocalStorage();
    render();
  }
}

// ================= RENDER DASHBOARD PAIS =================
function renderParentDashboard() {
  const tabs = ['hoje', 'semana', 'mes'];
  const tabButtons = tabs.map(tab => `
    <button onclick="setDashboardTab('${tab}')" class="px-3 py-1 ${appState.showDashboardTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-xl mr-2 capitalize">${tab}</button>
  `).join('');

  return `
    <div class="bg-white p-6 rounded-xl shadow-xl">
      <h2 class="text-2xl font-bold mb-4">Painel dos Pais</h2>
      <div class="mb-4">${tabButtons}</div>
      <div id="charts-container"></div>
      <button onclick="logout()" class="mt-6 bg-red-500 px-4 py-2 rounded">Sair</button>
    </div>
  `;
}

function setDashboardTab(tab) {
  appState.showDashboardTab = tab;
  render();
  renderCharts();
}

document.addEventListener('DOMContentLoaded', function () {
  loadFromLocalStorage();
  render();
});
