import React from 'react';
import { motion } from 'framer-motion';

const HistoryCalendar = ({ activity = [] }) => {
    // Generate dates for the last 15 weeks (105 days)
    const weeks = [];
    const today = new Date();

    // Find the latest Sunday
    const end = new Date(today);
    end.setDate(today.getDate() + (6 - today.getDay()));

    // Go back 15 weeks
    const start = new Date(end);
    start.setDate(end.getDate() - (15 * 7 - 1));

    let current = new Date(start);
    while (current <= end) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            const dateStr = current.toISOString().split('T')[0];
            const log = activity.find(l => l.date === dateStr);
            const count = log ? log.count : 0;

            week.push({
                date: dateStr,
                count,
                color: count === 0 ? 'bg-gray-100 dark:bg-gray-800' :
                    count < 3 ? 'bg-emerald-200 dark:bg-emerald-900/50' :
                        count < 6 ? 'bg-emerald-400 dark:bg-emerald-700' :
                            'bg-emerald-600 dark:bg-emerald-500'
            });
            current.setDate(current.getDate() + 1);
        }
        weeks.push(week);
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-[3px]">
                {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3px]">
                        {week.map((day, dIdx) => (
                            <motion.div
                                key={day.date}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (wIdx * 7 + dIdx) * 0.005 }}
                                className={`w-3 h-3 rounded-[2px] ${day.color} transition-all duration-500 hover:ring-2 hover:ring-blue-500/50 cursor-pointer`}
                                title={`${day.date}: ${day.count} solved`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center text-[9px] text-gray-400 uppercase font-black tracking-widest px-1">
                <span>Less</span>
                <div className="flex gap-1 ml-auto mr-1">
                    <div className="w-2 h-2 rounded-[1px] bg-gray-100 dark:bg-gray-800" />
                    <div className="w-2 h-2 rounded-[1px] bg-emerald-200 dark:bg-emerald-900/50" />
                    <div className="w-2 h-2 rounded-[1px] bg-emerald-400 dark:bg-emerald-700" />
                    <div className="w-2 h-2 rounded-[1px] bg-emerald-600 dark:bg-emerald-500" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default HistoryCalendar;
