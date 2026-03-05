import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const PerformanceChart = ({ beats = 75 }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Mock distribution data
    const dataPoints = [2, 5, 12, 25, 45, 80, 50, 25, 10, 5];
    const labels = dataPoints.map((_, i) => `${i * 10}-${(i + 1) * 10}ms`);

    // Highlight the user's bucket
    const bucketIndex = Math.min(Math.floor((100 - beats) / 10), 9);

    const data = {
        labels: labels,
        datasets: [
            {
                data: dataPoints,
                backgroundColor: dataPoints.map((_, i) =>
                    i === bucketIndex
                        ? (isDark ? '#10b981' : '#059669') // Emerald for highlight
                        : (isDark ? '#374151' : '#e5e7eb') // Gray for others
                ),
                borderRadius: 6,
                hoverBackgroundColor: isDark ? '#4b5563' : '#d1d5db',
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                titleColor: isDark ? '#fff' : '#111',
                bodyColor: isDark ? '#fff' : '#111',
                borderColor: isDark ? '#4b5563' : '#e5e7eb',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            x: {
                display: false,
                grid: { display: false }
            },
            y: {
                display: false,
                grid: { display: false }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="w-full h-20 bg-transparent mt-4">
            <Bar data={data} options={options} />
        </div>
    );
};

export default PerformanceChart;
