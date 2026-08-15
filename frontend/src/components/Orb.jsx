import {
  startTransition,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import "../stylesheets/Orb.css";

/**
 * Orb — glowing ring + mirrored flowing sound waves
 * + starfield backdrop.
 *
 * Props:
 *   size      - number, ring diameter in px (default 220)
 *   label     - optional text shown under the ring
 *   hint      - optional secondary line under the label
 *   showStars - boolean, render the twinkling starfield behind the orb
 *               (default true)
 */

export default function Orb({
  size = 220,
  label,
  hint,
  showStars = true,
}) {
  // Animation is always active.
  const animate = true;

  const [phase, setPhase] = useState(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const instanceId = useId().replace(/:/g, "");

  const ringGradId = `orbRingGrad-${instanceId}`;
  const waveGradId = `orbWaveGrad-${instanceId}`;
  const ringGlowId = `orbRingGlow-${instanceId}`;
  const waveGlowId = `orbWaveGlow-${instanceId}`;
  const barGlowId = `orbBarGlow-${instanceId}`;

  // ViewBox scales with `size` so waves have room either side of the ring.
  const vw = size * 3.2;
  const vh = size * 1.36;
  const cx = vw / 2;
  const cy = vh / 2;
  const ringR = size / 2;

  // ---- continuous animation ----
  useEffect(() => {
    if (!animate) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = null;
      lastTimeRef.current = null;
      return;
    }

    if (typeof window === "undefined") return;

    const tick = (time) => {
      const prev = lastTimeRef.current ?? time;
      const dt = Math.min((time - prev) / 1000, 0.05);

      lastTimeRef.current = time;

      startTransition(() => {
        setPhase((p) => p + dt);
      });

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [animate]);

  // ---- flowing mirrored sound-wave lines ----
  const waveDefs = useMemo(
    () => [
      {
        amp: 0.3 * size,
        freq: 1.6,
        speed: 1.0,
        opacity: 0.85,
        width: 1.6,
        offset: 0,
      },
      {
        amp: 0.15 * size,
        freq: 2.1,
        speed: 1.5,
        opacity: 0.6,
        width: 1.2,
        offset: 1.1,
      },
      {
        amp: 0.11 * size,
        freq: 2.7,
        speed: 1,
        opacity: 0.4,
        width: 1,
        offset: 2.3,
      },
    ],
    [size],
  );

  const wavePaths = useMemo(() => {
    const left = vw * 0.02;
    const right = vw * 0.98;
    const points = 60;
    const step = (right - left) / (points - 1);

    return waveDefs.map((wave, wi) => {
      const buildSide = (sign) => {
        let d = "";

        for (let i = 0; i < points; i++) {
          const x = left + i * step;
          const t = i / (points - 1);

          // Distance from ring center, used to bulge
          // the wave near the ring.
          const distFromCenter =
            Math.abs(x - cx) / (vw / 2);

          const bulge =
            Math.exp(-Math.pow(distFromCenter * 2.1, 2)) *
              0.55 +
            0.45;

          const edgeFade = Math.sin(t * Math.PI);

          const y =
            cy +
            sign *
              Math.sin(
                t * Math.PI * wave.freq * 4 +
                  phase * wave.speed +
                  wave.offset,
              ) *
              wave.amp *
              bulge *
              edgeFade;

          d +=
            (i === 0 ? "M " : "L ") +
            x.toFixed(2) +
            " " +
            y.toFixed(2) +
            " ";
        }

        return d;
      };

      return {
        key: `wave-${wi}`,
        top: buildSide(1),
        bottom: buildSide(-1),
        ...wave,
      };
    });
  }, [cx, cy, phase, vw, waveDefs]);

  // ---- center equalizer bars ----
  // Kept from the original animation structure.
  const barCount = 9;

  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const seed = i * 1.37;

      return {
        key: `bar-${i}`,
        seed,
        index: i,
      };
    });
  }, []);

  const barMaxH = ringR * 0.72;
  const barGap = (ringR * 1.5) / barCount;
  const barStartX =
    cx - (barGap * (barCount - 1)) / 2;

  // Prevent unused-variable warnings if the bars
  // are not rendered yet.
  void bars;
  void barMaxH;
  void barStartX;
  void barGlowId;

  // ---- starfield ----
  const stars = useMemo(() => {
    if (!showStars) return [];

    return Array.from({ length: 45 }, (_, i) => ({
      key: `star-${i}`,
      x: Math.random() * vw,
      y: Math.random() * vh,
      r: Math.random() * 1.1 + 0.3,
      dur: 2 + Math.random() * 3,
      delay: Math.random() * 3,
    }));
  }, [showStars, vw, vh]);

  void stars;

  return (
    <div
      className="orb"
      style={{
        width: "100%",
        maxWidth: vw,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        width="100%"
        role="img"
        aria-label={label || "Animated orb"}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Ring gradient */}
          <linearGradient
            id={ringGradId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="#e94ff5"
            />
            <stop
              offset="30%"
              stopColor="#b06bff"
            />
            <stop
              offset="65%"
              stopColor="#5b8bff"
            />
            <stop
              offset="100%"
              stopColor="#4fd8ff"
            />
          </linearGradient>

          {/* Wave gradient */}
          <linearGradient
            id={waveGradId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="#e94ff5"
              stopOpacity="0.05"
            />
            <stop
              offset="25%"
              stopColor="#c26bff"
              stopOpacity="0.75"
            />
            <stop
              offset="50%"
              stopColor="#9a7bff"
              stopOpacity="0.9"
            />
            <stop
              offset="75%"
              stopColor="#5fa8ff"
              stopOpacity="0.75"
            />
            <stop
              offset="100%"
              stopColor="#4fd8ff"
              stopOpacity="0.05"
            />
          </linearGradient>

          {/* Ring glow */}
          <filter
            id={ringGlowId}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur
              stdDeviation={size * 0.02}
              result="near"
            />

            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={size * 0.06}
              result="far"
            />

            <feMerge>
              <feMergeNode in="far" />
              <feMergeNode in="near" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Wave glow */}
          <filter
            id={waveGlowId}
            x="-10%"
            y="-100%"
            width="120%"
            height="300%"
          >
            <feGaussianBlur
              stdDeviation={size * 0.012}
              result="near"
            />

            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={size * 0.03}
              result="far"
            />

            <feMerge>
              <feMergeNode in="far" />
              <feMergeNode in="near" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Mirrored flowing sound-wave lines */}
        <g filter={`url(#${waveGlowId})`}>
          {wavePaths.map((w) => (
            <g
              key={w.key}
              opacity={w.opacity}
            >
              <path
                d={w.top}
                fill="none"
                stroke={`url(#${waveGradId})`}
                strokeWidth={w.width}
                strokeLinecap="round"
              />

              <path
                d={w.bottom}
                fill="none"
                stroke={`url(#${waveGradId})`}
                strokeWidth={w.width}
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>

        {/* Static glowing ring */}
        <g filter={`url(#${ringGlowId})`}>
          <circle
            cx={cx}
            cy={cy}
            r={ringR}
            fill="none"
            stroke={`url(#${ringGradId})`}
            strokeWidth={size * 0.022}
          />
        </g>
      </svg>

      {/* Optional label */}
      {label && (
        <div
          style={{
            marginTop: size * 0.08,
            color: "#e7e6fb",
            fontSize: Math.max(13, size * 0.075),
            fontFamily: "inherit",
            letterSpacing: 0.2,
          }}
        >
          {label}
        </div>
      )}

      {/* Optional hint */}
      {hint && (
        <div
          style={{
            marginTop: size * 0.02,
            color: "#8b87b8",
            fontSize: Math.max(11, size * 0.055),
            fontFamily: "inherit",
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}