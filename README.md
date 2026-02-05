
# TRACE | Signal Intelligence Unit

High-fidelity synthetic speech detection system based on the AASIST HtrgGAT deep learning architecture.

## Deployment

1. **Environment Variables**: Ensure you set `API_KEY` in your production environment (Vercel, Netlify, etc.) using a key from [Google AI Studio](https://aistudio.google.com/).
2. **Install Dependencies**: `npm install`
3. **Build**: `npm run build`
4. **Deploy**: Upload the `dist/` folder to your static host.

## Methodology
The TRACE engine leverages an Integrated Spectro-Temporal Graph Attention Network (AASIST) to analyze audio features as nodes in a high-dimensional graph, detecting anomalies that traditional spectrogram-based models often miss.

- **Sinc-Convolutional Front-end**
- **Heterogeneous Graph Attention (HtrgGAT)**
- **Attention-Based Graph Pooling**

---
© 2024 Team STRATAGEM
