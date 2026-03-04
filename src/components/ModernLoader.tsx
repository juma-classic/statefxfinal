import React, { useEffect, useState, useRef } from 'react';
import './ModernLoader.scss';

interface ModernLoaderProps {
    onFinish: () => void;
}

const ModernLoader: React.FC<ModernLoaderProps> = ({ onFinish }) => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initializing');
    const [dots, setDots] = useState('');
    const [tradingTip, setTradingTip] = useState('');
    const [lightningActive, setLightningActive] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Trading tips and motivational quotes
    const tradingTips = [
        'Building wealth through smart trading',
        'Your trusted partner in market success',
        'Professional trading strategies for everyone',
        'Precision trading, consistent results',
        'Quality execution in every trade',
        'Navigate markets with confidence',
        'Fast execution, reliable returns',
        'Growing your portfolio steadily',
        'State FX - Your path to financial freedom',
        'Elevate your trading experience',
    ];

    // Trading-themed background animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Detect mobile device
        const isMobile = window.innerWidth <= 768;
        
        // Adjust sizes and counts for mobile
        const currencyCount = isMobile ? 15 : 25;
        const currencySizeMin = isMobile ? 12 : 20;
        const currencySizeMax = isMobile ? 20 : 30;
        const arrowCount = isMobile ? 8 : 15;
        const arrowSize = isMobile ? 0.6 : 1;
        const chartLineCount = isMobile ? 5 : 8;

        // Currency symbols floating upward
        const currencies: Array<{
            x: number;
            y: number;
            symbol: string;
            speed: number;
            opacity: number;
            size: number;
            rotation: number;
            rotationSpeed: number;
        }> = [];

        const currencySymbols = ['$', '€', '£', '¥', '₿', '₹', '₽', 'Ƀ'];
        for (let i = 0; i < currencyCount; i++) {
            currencies.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                symbol: currencySymbols[Math.floor(Math.random() * currencySymbols.length)],
                speed: Math.random() * 0.8 + 0.3,
                opacity: Math.random() * 0.4 + 0.1,
                size: Math.random() * (currencySizeMax - currencySizeMin) + currencySizeMin,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
            });
        }

        // Rising profit arrows
        const arrows: Array<{
            x: number;
            y: number;
            speed: number;
            opacity: number;
            color: string;
        }> = [];

        for (let i = 0; i < arrowCount; i++) {
            arrows.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: Math.random() * 1.2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: '#00FF88',
            });
        }

        // Animated chart lines
        const chartLines: Array<{
            points: Array<{ x: number; y: number }>;
            speed: number;
            opacity: number;
            color: string;
        }> = [];

        for (let i = 0; i < chartLineCount; i++) {
            const points = [];
            const startY = Math.random() * canvas.height;
            for (let j = 0; j < 10; j++) {
                points.push({
                    x: (canvas.width / 10) * j,
                    y: startY + (Math.random() - 0.5) * 100,
                });
            }
            chartLines.push({
                points,
                speed: Math.random() * 0.3 + 0.1,
                opacity: Math.random() * 0.2 + 0.05,
                color: Math.random() > 0.5 ? '#00BFFF' : '#FFD700',
            });
        }

        const draw = () => {
            // Dark gradient background
            const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            bgGradient.addColorStop(0, 'rgba(10, 14, 39, 0.95)');
            bgGradient.addColorStop(0.5, 'rgba(15, 20, 25, 0.95)');
            bgGradient.addColorStop(1, 'rgba(20, 10, 20, 0.95)');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw animated chart lines
            chartLines.forEach(line => {
                ctx.globalAlpha = line.opacity;
                ctx.strokeStyle = line.color;
                ctx.lineWidth = isMobile ? 1.5 : 2;
                ctx.shadowBlur = isMobile ? 6 : 10;
                ctx.shadowColor = line.color;

                ctx.beginPath();
                line.points.forEach((point, index) => {
                    if (index === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                });
                ctx.stroke();

                // Move line points
                line.points.forEach(point => {
                    point.x -= line.speed;
                    if (point.x < -50) {
                        point.x = canvas.width + 50;
                        point.y = Math.random() * canvas.height;
                    }
                });
            });

            ctx.shadowBlur = 0;

            // Draw currency symbols
            currencies.forEach(currency => {
                ctx.globalAlpha = currency.opacity;
                ctx.fillStyle = '#FFD700';
                ctx.font = `${currency.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.save();
                ctx.translate(currency.x, currency.y);
                ctx.rotate(currency.rotation);
                ctx.shadowBlur = isMobile ? 10 : 15;
                ctx.shadowColor = '#FFD700';
                ctx.fillText(currency.symbol, 0, 0);
                ctx.restore();

                // Move currency upward
                currency.y -= currency.speed;
                currency.rotation += currency.rotationSpeed;

                if (currency.y < -50) {
                    currency.y = canvas.height + 50;
                    currency.x = Math.random() * canvas.width;
                    currency.symbol = currencySymbols[Math.floor(Math.random() * currencySymbols.length)];
                }
            });

            ctx.shadowBlur = 0;

            // Draw profit arrows
            arrows.forEach(arrow => {
                ctx.globalAlpha = arrow.opacity;
                ctx.strokeStyle = arrow.color;
                ctx.fillStyle = arrow.color;
                ctx.lineWidth = isMobile ? 2 : 3;
                ctx.shadowBlur = isMobile ? 10 : 15;
                ctx.shadowColor = arrow.color;

                // Arrow shaft (scaled for mobile)
                const shaftLength = 20 * arrowSize;
                ctx.beginPath();
                ctx.moveTo(arrow.x, arrow.y + shaftLength);
                ctx.lineTo(arrow.x, arrow.y - shaftLength);
                ctx.stroke();

                // Arrow head (scaled for mobile)
                const headWidth = 8 * arrowSize;
                const headHeight = 10 * arrowSize;
                ctx.beginPath();
                ctx.moveTo(arrow.x, arrow.y - shaftLength);
                ctx.lineTo(arrow.x - headWidth, arrow.y - shaftLength + headHeight);
                ctx.lineTo(arrow.x + headWidth, arrow.y - shaftLength + headHeight);
                ctx.closePath();
                ctx.fill();

                // Move arrow upward
                arrow.y -= arrow.speed;

                if (arrow.y < -50) {
                    arrow.y = canvas.height + 50;
                    arrow.x = Math.random() * canvas.width;
                }
            });

            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        };

        const interval = setInterval(draw, 33);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Select random tip
        const randomTip = tradingTips[Math.floor(Math.random() * tradingTips.length)];
        setTradingTip(randomTip);

        // Multi-phase loading system
        const loadingPhases = [
            { duration: 1000, text: 'Initializing Platform', progress: 15 },
            { duration: 800, text: 'Loading Market Data', progress: 30 },
            { duration: 1200, text: 'Connecting to Markets', progress: 50 },
            { duration: 900, text: 'Activating Trading Signals', progress: 70 },
            { duration: 700, text: 'Loading Strategies', progress: 85 },
            { duration: 600, text: 'Preparing Dashboard', progress: 95 },
            { duration: 500, text: 'Welcome to State FX', progress: 100 },
        ];

        let currentPhase = 0;

        const executePhase = () => {
            if (currentPhase < loadingPhases.length) {
                const phase = loadingPhases[currentPhase];
                setLoadingText(phase.text);

                // Smooth progress animation
                const startProgress = progress;
                const targetProgress = phase.progress;
                const duration = phase.duration;
                const startTime = Date.now();

                const animateProgress = () => {
                    const elapsed = Date.now() - startTime;
                    const progressRatio = Math.min(elapsed / duration, 1);
                    const easeOutQuart = 1 - Math.pow(1 - progressRatio, 4);
                    const currentProgress = startProgress + (targetProgress - startProgress) * easeOutQuart;

                    setProgress(currentProgress);

                    if (progressRatio < 1) {
                        requestAnimationFrame(animateProgress);
                    } else {
                        currentPhase++;
                        if (currentPhase < loadingPhases.length) {
                            setTimeout(executePhase, 100);
                        } else {
                            setTimeout(onFinish, 800);
                        }
                    }
                };

                requestAnimationFrame(animateProgress);
            }
        };

        executePhase();

        // Dots animation
        let dotCount = 0;
        const dotInterval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            setDots('.'.repeat(dotCount));
        }, 400);

        // Lightning strike effect
        const lightningInterval = setInterval(() => {
            setLightningActive(true);
            setTimeout(() => setLightningActive(false), 200);
        }, 2000);

        return () => {
            clearInterval(dotInterval);
            clearInterval(lightningInterval);
        };
    }, [onFinish]);

    return (
        <div className='modern-loader zeus-loader'>
            {/* Matrix-style falling money and code background */}
            <canvas ref={canvasRef} className='zeus-loader__matrix-canvas' />

            {/* Lightning flash overlay */}
            <div className={`zeus-loader__lightning-flash ${lightningActive ? 'active' : ''}`} />

            {/* Dark storm clouds background */}
            <div className='zeus-loader__storm-bg'>
                <div className='zeus-loader__cloud zeus-loader__cloud--1' />
                <div className='zeus-loader__cloud zeus-loader__cloud--2' />
                <div className='zeus-loader__cloud zeus-loader__cloud--3' />
            </div>

            {/* Main content */}
            <div className='zeus-loader__content'>
                {/* State FX Lion Logo */}
                <div className='zeus-loader__logo-container'>
                    <svg 
                        className='zeus-loader__logo zeus-loader__lion-logo'
                        viewBox='0 0 200 200'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <defs>
                            <linearGradient id='lionGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                                <stop offset='0%' stopColor='#FFD700' />
                                <stop offset='50%' stopColor='#FFA500' />
                                <stop offset='100%' stopColor='#FF8C00' />
                            </linearGradient>
                            <radialGradient id='maneGradient' cx='50%' cy='50%'>
                                <stop offset='0%' stopColor='#FFD700' stopOpacity='0.9' />
                                <stop offset='70%' stopColor='#FFA500' stopOpacity='0.7' />
                                <stop offset='100%' stopColor='#FF8C00' stopOpacity='0.5' />
                            </radialGradient>
                            <filter id='lionGlow'>
                                <feGaussianBlur stdDeviation='3' result='coloredBlur' />
                                <feMerge>
                                    <feMergeNode in='coloredBlur' />
                                    <feMergeNode in='SourceGraphic' />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Majestic Mane - Multiple layers for depth */}
                        <circle cx='100' cy='100' r='75' fill='url(#maneGradient)' opacity='0.3' filter='url(#lionGlow)' />
                        <circle cx='100' cy='100' r='65' fill='url(#maneGradient)' opacity='0.4' filter='url(#lionGlow)' />
                        
                        {/* Mane spikes - Crown-like */}
                        {[...Array(16)].map((_, i) => {
                            const angle = (i * 22.5 * Math.PI) / 180;
                            const x1 = 100 + Math.cos(angle) * 55;
                            const y1 = 100 + Math.sin(angle) * 55;
                            const x2 = 100 + Math.cos(angle) * 80;
                            const y2 = 100 + Math.sin(angle) * 80;
                            return (
                                <path
                                    key={i}
                                    d={`M ${x1} ${y1} Q ${100 + Math.cos(angle) * 70} ${100 + Math.sin(angle) * 70} ${x2} ${y2}`}
                                    stroke='url(#lionGradient)'
                                    strokeWidth='8'
                                    fill='none'
                                    opacity='0.6'
                                    strokeLinecap='round'
                                />
                            );
                        })}

                        {/* Lion's Head - Main circle */}
                        <circle cx='100' cy='100' r='45' fill='url(#lionGradient)' filter='url(#lionGlow)' />
                        
                        {/* Facial features shadow */}
                        <ellipse cx='100' cy='110' rx='35' ry='30' fill='#FF8C00' opacity='0.3' />

                        {/* Ears */}
                        <ellipse cx='70' cy='70' rx='15' ry='20' fill='url(#lionGradient)' transform='rotate(-20 70 70)' />
                        <ellipse cx='130' cy='70' rx='15' ry='20' fill='url(#lionGradient)' transform='rotate(20 130 70)' />
                        <ellipse cx='70' cy='72' rx='8' ry='12' fill='#FF8C00' transform='rotate(-20 70 72)' />
                        <ellipse cx='130' cy='72' rx='8' ry='12' fill='#FF8C00' transform='rotate(20 130 72)' />

                        {/* Eyes - Fierce and focused */}
                        <ellipse cx='85' cy='95' rx='8' ry='12' fill='#1a1a1a' />
                        <ellipse cx='115' cy='95' rx='8' ry='12' fill='#1a1a1a' />
                        <circle cx='86' cy='93' r='3' fill='#FFD700' opacity='0.8' />
                        <circle cx='116' cy='93' r='3' fill='#FFD700' opacity='0.8' />
                        <circle cx='87' cy='91' r='1.5' fill='white' />
                        <circle cx='117' cy='91' r='1.5' fill='white' />

                        {/* Nose */}
                        <path
                            d='M 100 105 L 95 112 Q 100 115 105 112 Z'
                            fill='#1a1a1a'
                        />

                        {/* Mouth - Confident smile */}
                        <path
                            d='M 100 112 Q 85 120 75 118'
                            stroke='#1a1a1a'
                            strokeWidth='2.5'
                            fill='none'
                            strokeLinecap='round'
                        />
                        <path
                            d='M 100 112 Q 115 120 125 118'
                            stroke='#1a1a1a'
                            strokeWidth='2.5'
                            fill='none'
                            strokeLinecap='round'
                        />

                        {/* Whisker dots */}
                        <circle cx='65' cy='105' r='2' fill='#1a1a1a' />
                        <circle cx='60' cy='110' r='2' fill='#1a1a1a' />
                        <circle cx='135' cy='105' r='2' fill='#1a1a1a' />
                        <circle cx='140' cy='110' r='2' fill='#1a1a1a' />

                        {/* Chin tuft */}
                        <ellipse cx='100' cy='135' rx='12' ry='8' fill='url(#lionGradient)' opacity='0.8' />
                        <path
                            d='M 95 135 Q 100 142 105 135'
                            stroke='url(#lionGradient)'
                            strokeWidth='4'
                            fill='none'
                            opacity='0.6'
                        />
                    </svg>
                    <div className='zeus-loader__logo-glow' />
                    <div className='zeus-loader__logo-glow zeus-loader__logo-glow--secondary' />
                </div>

                {/* Zeus Lightning Bolt Icon */}
                <div className='zeus-loader__lightning-container' style={{ display: 'none' }}>
                    {/* Animated lightning bolt with intricate parts */}
                    <svg
                        className='zeus-loader__lightning-bolt'
                        viewBox='0 0 200 300'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <defs>
                            <linearGradient id='lightningGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                                <stop offset='0%' stopColor='#FFD700' />
                                <stop offset='50%' stopColor='#FFA500' />
                                <stop offset='100%' stopColor='#FF6B00' />
                            </linearGradient>
                            <filter id='glow'>
                                <feGaussianBlur stdDeviation='4' result='coloredBlur' />
                                <feMerge>
                                    <feMergeNode in='coloredBlur' />
                                    <feMergeNode in='SourceGraphic' />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Main lightning bolt */}
                        <path
                            className='zeus-loader__bolt-main'
                            d='M100 10 L80 100 L120 100 L90 180 L130 120 L100 120 L110 60 Z'
                            fill='url(#lightningGradient)'
                            filter='url(#glow)'
                        />

                        {/* Electric arcs - animated parts */}
                        <path
                            className='zeus-loader__bolt-arc zeus-loader__bolt-arc--1'
                            d='M85 50 Q70 60 75 80'
                            stroke='#4169E1'
                            strokeWidth='2'
                            fill='none'
                            opacity='0.8'
                        />
                        <path
                            className='zeus-loader__bolt-arc zeus-loader__bolt-arc--2'
                            d='M115 70 Q130 80 125 100'
                            stroke='#00BFFF'
                            strokeWidth='2'
                            fill='none'
                            opacity='0.8'
                        />
                        <path
                            className='zeus-loader__bolt-arc zeus-loader__bolt-arc--3'
                            d='M95 130 Q80 140 85 160'
                            stroke='#FFD700'
                            strokeWidth='2'
                            fill='none'
                            opacity='0.8'
                        />

                        {/* Energy particles */}
                        {[...Array(8)].map((_, i) => (
                            <circle
                                key={i}
                                className='zeus-loader__energy-particle'
                                cx={100 + Math.cos((i * Math.PI) / 4) * 40}
                                cy={100 + Math.sin((i * Math.PI) / 4) * 40}
                                r='3'
                                fill='#FFD700'
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))}

                        {/* Rotating energy ring */}
                        <circle
                            className='zeus-loader__energy-ring'
                            cx='100'
                            cy='100'
                            r='60'
                            fill='none'
                            stroke='#4169E1'
                            strokeWidth='2'
                            strokeDasharray='10 5'
                            opacity='0.5'
                        />
                    </svg>

                    {/* Pulsing glow effect */}
                    <div className='zeus-loader__lightning-glow' />
                    <div className='zeus-loader__lightning-glow zeus-loader__lightning-glow--secondary' />
                </div>

                {/* Brand name */}
                <h1 className='zeus-loader__brand'>
                    <span className='zeus-loader__brand-zeus'>STATE</span>
                    <span className='zeus-loader__brand-trading'>FX</span>
                </h1>

                <p className='zeus-loader__tagline'>Professional Trading Platform</p>

                {/* Loading text */}
                <div className='zeus-loader__text-container'>
                    <div className='zeus-loader__text'>
                        {loadingText}
                        {dots}
                    </div>
                </div>

                {/* Progress bar with electric effect */}
                <div className='zeus-loader__progress-container'>
                    <div className='zeus-loader__progress-label'>
                        <span>Power Level</span>
                        <span className='zeus-loader__progress-percentage'>{Math.round(Math.min(progress, 100))}%</span>
                    </div>
                    <div className='zeus-loader__progress-bar'>
                        <div className='zeus-loader__progress-fill' style={{ width: `${Math.min(progress, 100)}%` }}>
                            <div className='zeus-loader__progress-lightning' />
                        </div>
                    </div>
                </div>

                {/* Trading Tip */}
                <div className='zeus-loader__trading-tip'>
                    <div className='zeus-loader__tip-icon'>
                        <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                            <defs>
                                <linearGradient id='iconGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                                    <stop offset='0%' stopColor='#FFD700' />
                                    <stop offset='100%' stopColor='#FFA500' />
                                </linearGradient>
                            </defs>
                            {/* Mechanical gear icon */}
                            <circle cx='12' cy='12' r='3' fill='url(#iconGradient)' />
                            <path
                                d='M12 1L13.5 4.5L17 3L16 6.5L19.5 7.5L17.5 10.5L21 12L17.5 13.5L19.5 16.5L16 17.5L17 21L13.5 19.5L12 23L10.5 19.5L7 21L8 17.5L4.5 16.5L6.5 13.5L3 12L6.5 10.5L4.5 7.5L8 6.5L7 3L10.5 4.5L12 1Z'
                                fill='url(#iconGradient)'
                                opacity='0.6'
                            />
                            {/* Inner mechanical details */}
                            <circle cx='12' cy='12' r='5' fill='none' stroke='#FFD700' strokeWidth='0.5' />
                            <circle cx='12' cy='12' r='7' fill='none' stroke='#FFA500' strokeWidth='0.3' />
                        </svg>
                    </div>
                    <p className='zeus-loader__tip-text'>{tradingTip}</p>
                </div>
            </div>
        </div>
    );
};

export default ModernLoader;
