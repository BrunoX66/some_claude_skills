'use client';

import React from 'react';
import {
  Lasso,
  Square,
  Eraser,
  PaintBucket,
  Pipette,
  Search,
  Pencil,
  Brush,
  Sparkles,
  Type,
  Minus,
  Spline,
  RectangleHorizontal,
  Pentagon,
  Circle,
  SquareAsterisk,
} from 'lucide-react';
import { ToolType } from '@/lib/mspaint/types';

const ICON_SIZE = 16;
const STROKE_WIDTH = 1.5;

// Map tool IDs to Lucide icons
export const ToolIcon: React.FC<{ tool: ToolType; className?: string }> = ({ tool, className }) => {
  const props = {
    size: ICON_SIZE,
    strokeWidth: STROKE_WIDTH,
    className,
  };

  switch (tool) {
    case 'freeformSelect':
      return <Lasso {...props} />;
    case 'rectangleSelect':
      return <Square {...props} />;
    case 'eraser':
      return <Eraser {...props} />;
    case 'fill':
      return <PaintBucket {...props} />;
    case 'colorPicker':
      return <Pipette {...props} />;
    case 'magnifier':
      return <Search {...props} />;
    case 'pencil':
      return <Pencil {...props} />;
    case 'brush':
      return <Brush {...props} />;
    case 'airbrush':
      return <Sparkles {...props} />;
    case 'text':
      return <Type {...props} />;
    case 'line':
      return <Minus {...props} style={{ transform: 'rotate(-45deg)' }} />;
    case 'curve':
      return <Spline {...props} />;
    case 'rectangle':
      return <RectangleHorizontal {...props} />;
    case 'polygon':
      return <Pentagon {...props} />;
    case 'ellipse':
      return <Circle {...props} />;
    case 'roundedRectangle':
      return <SquareAsterisk {...props} />;
    default:
      return <Square {...props} />;
  }
};
