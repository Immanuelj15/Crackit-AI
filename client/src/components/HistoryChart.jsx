import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const HistoryChart = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <span className="text-4xl mb-2">📉</span>
                <p>No test history available yet.</p>
            </div>
        );
    }

    // Process data: Reverse to show oldest to newest
    const dataPoints = [...history].reverse();
    const labels = dataPoints.map((item, index) => `Test ${index + 1}`);
    const scores = dataPoints.map(item => item.accuracy);

    const data = {
        labels,
        datasets: [
            {
                label: 'Accuracy (%)',
                data: scores,
                borderColor: '#0ea5e9', // Sky 500
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.5)');
                    gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#0ea5e9',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#e2e8f0',
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    title: (items) => {
                        const item = dataPoints[items[0].dataIndex];
                        return `${item.topic?.name || 'Test'} (${new Date(item.createdAt).toLocaleDateString()})`;
                    },
                    label: (context) => `Accuracy: ${context.parsed.y.toFixed(1)}%`
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    display: false, // Hide x-axis labels for cleaner look if many tests
                },
            },
        },
    };

    return (
        <div className="h-64 w-full">
            <Line data={data} options={options} />
        </div>
    );
};

export default HistoryChart;
