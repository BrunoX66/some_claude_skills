"use client";

import { Win31Window, Win31Prose } from "@/components/win31";

const sampleMarkdown = `# Computer Vision Pipeline

Expert in building production CV pipelines for **object detection**, tracking, and video analysis.

## Features

- Real-time object detection with YOLO
- Multi-object tracking across frames
- Video analytics dashboards

### Code Example

\`\`\`python
import cv2
detector = cv2.dnn.readNet("yolov8.weights")
\`\`\`

> **Note:** This skill pairs well with \`drone-cv-expert\` for aerial footage processing.

| Model | FPS | mAP |
|-------|-----|-----|
| YOLOv8n | 120 | 37.3 |
| YOLOv8s | 80 | 44.9 |
| YOLOv8m | 50 | 50.2 |

---

## Getting Started

1. Install dependencies with \`pip install ultralytics\`
2. Download the pretrained weights
3. Run the inference script

For more details, see the [Ultralytics docs](https://docs.ultralytics.com).
`;

export function ProseDemo() {
  return (
    <Win31Window
      title="SKILL.md - Computer Vision Pipeline"
      initialWidth={640}
      initialHeight={560}
      isActive
    >
      <div className="p-4 overflow-y-auto max-h-[480px]">
        <Win31Prose content={sampleMarkdown} />
      </div>
    </Win31Window>
  );
}
