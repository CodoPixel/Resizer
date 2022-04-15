import React from "react";
import { useRef } from "react";
import classes from "../styles/Resizer.module.css";

type Side = "right" | "bottom";

interface ResizerProps {
  className?: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  right?: boolean;
  bottom?: boolean;
  draggable?: boolean;
  children?: React.ReactNode;
}

interface ResizeableSide {
  side: Side;
  handler?: React.MouseEventHandler<HTMLDivElement>;
}

interface ResizeableAngle {
  handler?: React.MouseEventHandler<HTMLDivElement>;
}

const Resizer: React.FC<ResizerProps> = ({
  className = "",
  draggable = false,
  maxWidth = Infinity,
  minWidth = 0,
  maxHeight = Infinity,
  minHeight = 0,
  right = true,
  bottom = true,
  children,
}) => {
  const element = useRef<HTMLDivElement | null>(null);
  let aspectRatio: number | null = null;
  let x = 0;
  let y = 0;
  let w = 0;
  let h = 0;
  let posX = 0;
  let posY = 0;

  const mouseDownHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (element.current == null) {
      return;
    }

    // Get the current mouse position
    x = e.clientX;
    y = e.clientY;

    // Detect whether the angle has been selected
    const target = e.target as HTMLElement;
    const keepAspectRatio = target && target.classList.contains(classes.angleTopRight);

    // Calculate the dimension of element
    const styles = window.getComputedStyle(element.current);
    w = parseInt(styles.width, 10);
    h = parseInt(styles.height, 10);
    if (keepAspectRatio) aspectRatio = w / h;

    // Attach the listeners to `document`
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    if (element.current == null) {
      return;
    }

    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    // Adjust the dimension of element
    if (aspectRatio != null) {
      let width = w + dx;
      let height = h + dy;
      if (aspectRatio > 1) {
        height = width * aspectRatio;
      } else {
        height = width / aspectRatio;
      }
      if (width > minWidth && width < maxWidth && height > minHeight && height < maxHeight) {
        element.current.style.width = `${width}px`;
        element.current.style.height = `${height}px`;
      }
    } else {
      if (w + dx > minWidth && w + dx < maxWidth) {
        element.current.style.width = `${w + dx}px`;
      }
      if (h + dy > minHeight && h + dy < maxHeight) {
        element.current.style.height = `${h + dy}px`;
      }
    }
  };

  const mouseUpHandler = () => {
    // Remove the handlers
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
    aspectRatio = null;
  };

  const startDragging: React.MouseEventHandler<HTMLDivElement> = (e) => {
    // Get the current mouse position
    posX = e.clientX;
    posY = e.clientY;

    // Attach the listeners to `document`
    document.addEventListener("mousemove", dragHandler);
    document.addEventListener("mouseup", dragEndHandler);
  };

  const dragHandler = (e: MouseEvent) => {
    if (element.current == null) {
      return;
    }

    // How far the mouse has been moved
    const dx = e.clientX - posX;
    const dy = e.clientY - posY;

    // Set the position of element
    element.current.style.top = `${element.current.offsetTop + dy}px`;
    element.current.style.left = `${element.current.offsetLeft + dx}px`;

    // Reassign the position of mouse
    posX = e.clientX;
    posY = e.clientY;
  };

  const dragEndHandler = () => {
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener("mousemove", dragHandler);
    document.removeEventListener("mouseup", dragEndHandler);
  };

  return (
    <div className={classes.resizeableElement + " " + className} ref={element}>
      <div className={classes.drag} onMouseDown={draggable ? startDragging : undefined} />
      {children}
      {right ? <ResizeableSide side="right" handler={mouseDownHandler} /> : null}
      {bottom ? <ResizeableSide side="bottom" handler={mouseDownHandler} /> : null}
      <ResizeableAngle handler={mouseDownHandler} />
    </div>
  );
};

const ResizeableSide: React.FC<ResizeableSide> = ({ side, handler }) => {
  let className: string;

  switch (side) {
    case "right":
      className = classes.resizerRight;
      break;
    case "bottom":
      className = classes.resizerBottom;
      break;
    default:
      throw new Error(`Oops... I don't know how to spell '${side}'`);
  }
  return <div onMouseDown={handler} className={classes.resizer + " " + className} />;
};

const ResizeableAngle: React.FC<ResizeableAngle> = ({ handler }) => {
  return <div onMouseDown={handler} className={classes.resizer + " " + classes.angleTopRight} />;
};

export default Resizer;
