# iqc-canvas

[![npm version](https://img.shields.io/npm/v/iqc-canvas)](https://www.npmjs.com/package/iqc-canvas)

Generate **iPhone-style WhatsApp chat screenshots (PNG)** with reaction bar, context menu, reply blocks, stickers, and emoji support.

## ✨ Features

* Generate **images (PNG)**
* Auto bubble width (shrinks for short text, expands for long text)
* Reply block with **up to 3 lines** and `...` truncation
* **Emoji Support**: Apple style with Google fallback
* Reaction bar with custom emojis
* Sticker support

## 📦 Installation

```bash
git clone https://github.com/Hanzz98/iqc-canvas.git
cd iqc-canvas
npm install
```

## 🖼️ Generate Image

```javascript
const { generateIQC } = require('iqc-canvas');

const result = await generateIQC('Hello World', '00.00');

console.log(result);
```

## ⚙️ Options (generateIQC)

```typescript
type IQCOptions = {
  reply?: {
    sender: string; // Name shown in reply block
    text: string;   // Reply message text (auto-wrapped, max 3 lines)
  };

  reactionEmojis?: string[]; // Must be exactly 6 or 7 (default: ['👍','❤️','😂','😮','😢','🙏','🤦'])
  showPlusBtn?: boolean;     // Show/hide + button on reaction bar (default: true)
  sticker?: string;          // Path to sticker image — must be square, 64–1024px
}
```

## 📤 Output

```javascript
{
  success: true,
  image: <Buffer>,
  mimeType: 'image/png',
  timestamp: 1767772355,
  message: 'Created by Hann Universe npm:iqc-canvas'
}
```

## 🧪 Full Example

```javascript
const { generateIQC } = require('iqc-canvas');

const result = await generateIQC('ngga ah', '21.22', {
  reply: {
    sender: 'Anda',
    text: 'single era dulu gasii'
  },
  reactionEmojis: ['👍', '❤️', '😂', '😮', '😢', '🙏', '🤦'],
  showPlusBtn: true,
});

require('fs').writeFileSync('output.png', result.image);
```

## 🛠 Requirements

* Node.js 18+