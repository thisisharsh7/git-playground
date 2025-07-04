"use client";

import { useEffect } from "react";

const PathInspector = () => {
  useEffect(() => {
    const tooltip = document.createElement("div");
    tooltip.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 6px;
      z-index: 99999;
      pointer-events: none;
      max-width: 600px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: none;
      font-family: monospace;
    `;
    document.body.appendChild(tooltip);

    const getElementPath = (el: HTMLElement | null): string => {
      if (!el || !el.tagName) return "";

      const path: string[] = [];

      while (el && el.nodeType === 1 && el.tagName.toLowerCase() !== "html") {
        let name = el.tagName.toLowerCase();

        // Prefer semantic identifiers
        const component = el.getAttribute("data-component") || el.getAttribute("data-id");
        if (component) {
          name += `[${component}]`;
        } else if (el.id) {
          name += `#${el.id}`;
        } else if (el.className && typeof el.className === "string") {
          const classes = el.className
            .split(" ")
            .filter(cls => cls && !cls.includes("dark") && cls.length < 30) // Filter noise
            .join(".");
          if (classes) name += `.${classes}`;
        }

        path.unshift(name);
        el = el.parentElement as HTMLElement;
      }

      return path.join(" > ");
    };

    const handleMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const path = getElementPath(el);
      if (!path) return;

      tooltip.innerText = path;
      tooltip.style.display = "block";

      const rect = el.getBoundingClientRect();
      tooltip.style.top = `${rect.top - 30}px`;
      tooltip.style.left = `${rect.left}px`;

      el.style.outline = "2px dashed red";
      setTimeout(() => {
        el.style.outline = "";
      }, 1500);
    };

    const handleMouseMove = (e: MouseEvent) => {
      tooltip.style.top = `${e.clientY - 40}px`;
      tooltip.style.left = `${e.clientX + 10}px`;
    };

    const handleMouseOut = () => {
      tooltip.style.display = "none";
    };

    const handleClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const path = getElementPath(el);
      if (path) {
        navigator.clipboard.writeText(path);
        tooltip.innerText = `📋 Copied: ${path}`;
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick);
      tooltip.remove();
    };
  }, []);

  return null;
};

export default PathInspector;
