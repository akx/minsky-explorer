import * as React from "react";
import { useControls } from "leva";
import { draw, Settings, settingsSchema } from "./drawer";

function useEvent(
  name: string,
  handler: ((event: Event) => void) | null,
  target = window,
) {
  React.useEffect(() => {
    if (!(handler && target)) {
      return;
    }
    target.addEventListener(name, handler);
    return () => target.removeEventListener(name, handler);
  }, [name, handler, target]);
}

function computeCanvasSize() {
  return Math.floor(
    Math.min(window.innerWidth * 0.8 - 200, window.innerHeight * 0.8),
  );
}

export default function App() {
  const [canvasSize, setCanvasSize] = React.useState(computeCanvasSize);
  useEvent("resize", () => {
    setCanvasSize(computeCanvasSize());
  });
  const settings: Settings = useControls(settingsSchema);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "black";
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw(canvas, settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasSize].concat(Object.values(settings)));

  return (
    <>
      <canvas ref={canvasRef} width={canvasSize} height={canvasSize} />
      <footer>
        Explore variations of the{" "}
        <a href="https://www.onirom.fr/ica.html">
          Minsky Integer Circle algorithm
        </a>{" "}
        (HAKMEM-149). No trigonometry here.{" "}
        <a href="https://github.com/akx/minsky-explorer">Implementation</a> by{" "}
        <a href="https://akx.github.io">@akx</a>.
      </footer>
    </>
  );
}
