'use client';

import { GiraffeObservation } from '@/lib/inaturalist';
import { bearingToCardinal } from '@/lib/geo';

interface CompassProps {
  giraffes: GiraffeObservation[];
  heading: number;
  needsPermission?: boolean;
  onRequestPermission?: () => void;
}

const COMPASS_SIZE = 320;
const CENTER = COMPASS_SIZE / 2;
const OUTER_RADIUS = 140;
const INNER_RADIUS = 110;

// Distance scaling: 10 miles = outer edge, closer = near center
const MAX_DISTANCE_FEET = 10 * 5280; // 10 miles in feet
const MIN_WAYPOINT_RADIUS = 70; // Don't overlap with center (r=60)
const MAX_WAYPOINT_RADIUS = 128; // Edge of compass

const DEGREE_MARKS = [
  { angle: 0, label: 'N', major: true },
  { angle: 45, label: 'NE', major: true },
  { angle: 90, label: 'E', major: true },
  { angle: 135, label: 'SE', major: true },
  { angle: 180, label: 'S', major: true },
  { angle: 225, label: 'SW', major: true },
  { angle: 270, label: 'W', major: true },
  { angle: 315, label: 'NW', major: true },
];

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

interface WaypointProps {
  obs: GiraffeObservation;
  heading: number;
  index: number;
}

function GiraffeWaypoint({ obs, heading, index }: WaypointProps) {
  const relBearing = (obs.bearing - heading + 360) % 360;
  const angle = degToRad(relBearing) - Math.PI / 2;

  // Calculate proportional radius based on distance
  // Closer = smaller radius (near center), farther = larger radius (near edge)
  const distanceRatio = Math.min(obs.distanceFeet / MAX_DISTANCE_FEET, 1);
  const waypointRadius = MIN_WAYPOINT_RADIUS + distanceRatio * (MAX_WAYPOINT_RADIUS - MIN_WAYPOINT_RADIUS);

  const x = CENTER + waypointRadius * Math.cos(angle);
  const y = CENTER + waypointRadius * Math.sin(angle);

  // Match the rank badge colors from GiraffeCard (amber-500, amber-400, amber-300)
  const colors = ['#f59e0b', '#fbbf24', '#fcd34d'];
  const color = colors[index] || colors[0];

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Glow ring */}
      <circle
        cx={0}
        cy={0}
        r={18}
        fill={color}
        opacity={0.15}
      />
      {/* Giraffe emoji */}
      <text
        x={0}
        y={6}
        textAnchor="middle"
        fontSize="24"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
      >
        🦒
      </text>
    </g>
  );
}

export default function Compass({
  giraffes,
  heading,
  needsPermission,
  onRequestPermission,
}: CompassProps) {
  const cardinal = bearingToCardinal(heading);

  const handleTap = () => {
    if (needsPermission && onRequestPermission) {
      onRequestPermission();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Compass SVG */}
      <div
        className={`relative ${needsPermission ? 'cursor-pointer' : ''}`}
        onClick={handleTap}
      >
        {/* Permission overlay */}
        {needsPermission && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/60 rounded-full" style={{ width: COMPASS_SIZE, height: COMPASS_SIZE }}>
            <div className="text-center px-8">
              <p className="text-gray-600 text-sm font-medium">Tap to enable</p>
              <p className="text-gray-400 text-xs mt-1">compass rotation</p>
            </div>
          </div>
        )}
        <svg
          width={COMPASS_SIZE}
          height={COMPASS_SIZE}
          viewBox={`0 0 ${COMPASS_SIZE} ${COMPASS_SIZE}`}
          style={{ overflow: 'visible' }}
        >
          {/* Background circle */}
          <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS + 8} fill="#f8f8f6" />

          {/* Outer ring */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={OUTER_RADIUS}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2"
          />

          {/* Inner ring */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_RADIUS}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity={0.3}
          />

          {/* Tick marks and labels */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = degToRad(i * 5 - heading);
            const isMajorMark = i % 9 === 0; // every 45°
            const isMinorMark = i % 3 === 0; // every 15°
            const tickOuter = OUTER_RADIUS;
            const tickInner = isMajorMark
              ? OUTER_RADIUS - 14
              : isMinorMark
              ? OUTER_RADIUS - 8
              : OUTER_RADIUS - 5;
            const x1 = CENTER + tickOuter * Math.cos(angle);
            const y1 = CENTER + tickOuter * Math.sin(angle);
            const x2 = CENTER + tickInner * Math.cos(angle);
            const y2 = CENTER + tickInner * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#1a1a1a"
                strokeWidth={isMajorMark ? 2 : 1}
                opacity={isMajorMark ? 1 : 0.4}
              />
            );
          })}

          {/* Cardinal direction labels */}
          {DEGREE_MARKS.map(({ angle, label }) => {
            const relAngle = degToRad(angle - heading) - Math.PI / 2;
            const r = OUTER_RADIUS - 26;
            const x = CENTER + r * Math.cos(relAngle);
            const y = CENTER + r * Math.sin(relAngle) + 4;
            const isNorth = label === 'N';
            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isNorth ? '13' : '10'}
                fontFamily="Inter, sans-serif"
                fontWeight={isNorth ? '800' : '600'}
                fill={isNorth ? '#f59e0b' : '#1a1a1a'}
              >
                {label}
              </text>
            );
          })}

          {/* Center heading display */}
          <circle cx={CENTER} cy={CENTER} r={60} fill="white" stroke="#e5e5e0" strokeWidth="1" />

          <text
            x={CENTER}
            y={CENTER - 10}
            textAnchor="middle"
            fontSize="28"
            fontFamily="Inter, sans-serif"
            fontWeight="800"
            fill="#1a1a1a"
          >
            {cardinal}
          </text>
          <text
            x={CENTER}
            y={CENTER + 16}
            textAnchor="middle"
            fontSize="13"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
            fill="#6b7280"
          >
            {Math.round(heading)}°
          </text>

          {/* North indicator needle */}
          <line
            x1={CENTER}
            y1={CENTER - 68}
            x2={CENTER}
            y2={CENTER - 80}
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Giraffe waypoints */}
          {giraffes.map((obs, i) => (
            <GiraffeWaypoint key={obs.id} obs={obs} heading={heading} index={i} />
          ))}
        </svg>
      </div>

    </div>
  );
}
