// charts.js

function renderCharts() {
  // Linha do tempo de XP
  const xpCtx = document.getElementById('xpLineChart').getContext('2d');
  new Chart(xpCtx, {
    type: 'line',
    data: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [{
        label: 'XP Ganho',
        data: [20, 30, 50, 40, 60, 80, 90],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        tension: 0.4,
        fill: true
      }]
    }
  });

  // Atividades por Semana
  const barCtx = document.getElementById('weeklyBarChart').getContext('2d');
  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [{
        label: 'Atividades Concluídas',
        data: [12, 15, 10, 18],
        backgroundColor: '#10B981'
      }]
    }
  });

  // Heatmap simulado
  const heatmapCtx = document.getElementById('heatmapChart').getContext('2d');
  new Chart(heatmapCtx, {
    type: 'bar',
    data: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Consistência',
        data: [1, 1, 1, 0, 1, 1, 0],
        backgroundColor: (ctx) => ctx.raw === 1 ? '#FBBF24' : '#E5E7EB'
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: true }
      }
    }
  });
}

