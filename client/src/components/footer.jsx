import React, { useState, useEffect } from 'react'
import { useSettings } from '@/context/SettingsContext'

const Footer = () => {
    const { settings } = useSettings();
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const tzName = settings.timezone || '(GMT+05:00) Karachi';
            let ianaTz = 'Asia/Karachi';
            let area = 'Karachi';

            if (tzName.includes('Dubai')) { ianaTz = 'Asia/Dubai'; area = 'Dubai'; }
            else if (tzName.includes('London')) { ianaTz = 'Europe/London'; area = 'London'; }
            else if (tzName.includes('Karachi')) { ianaTz = 'Asia/Karachi'; area = 'Karachi'; }

            try {
                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZone: ianaTz,
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                setTime(`${area} - ${formatter.format(new Date())}`);
            } catch (e) {
                setTime(`${area} - ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [settings.timezone]);

  return (
    <div className="flex items-center justify-end pr-5.5 pt-2 pb-1.5">
        <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            {time}
        </div>
    </div>
  )
}

export default Footer