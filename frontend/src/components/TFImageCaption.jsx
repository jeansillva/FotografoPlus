import React, { useEffect, useRef, useState } from "react";

export default function TFImageCaption({ imageUrl, onGenerated }) {
  const imgRef = useRef(null);
  const [loadingModel, setLoadingModel] = useState(false);
  const [generating, setGenerating] = useState(false);
  const modelRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const loadModel = async () => {
      setLoadingModel(true);
      const tf = await import("@tensorflow/tfjs");
      const mobilenet = await import("@tensorflow-models/mobilenet");
      modelRef.current = await mobilenet.load();
      if (mounted) setLoadingModel(false);
    };
    loadModel().catch(() => setLoadingModel(false));
    return () => {
      mounted = false;
    };
  }, []);

  const capitalize = (s) => s?.replace(/\b\w/g, (c) => c.toUpperCase()) || "";

  const buildOutput = (preds) => {
    const top = preds.slice(0, 3);
    const labels = top.map((p) => p.className.split(",")[0].trim());
    const title = capitalize(labels[0] || "Imagem");
    const description = `${labels.join(", ")}.`;
    return { title, description, tags: labels, raw: preds };
  };

  const handleGenerate = async () => {
    if (!modelRef.current) return alert("Modelo ainda carregando. Aguarde...");
    if (!imageUrl) return alert("Imagem ausente.");
    setGenerating(true);
    try {
      const img = imgRef.current;
      const preds = await modelRef.current.classify(img);
      const out = buildOutput(preds);
      onGenerated && onGenerated(out);
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar tags IA.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <img
        ref={imgRef}
        src={imageUrl}
        alt="preview-for-tf"
        style={{ display: "none" }}
        crossOrigin="anonymous"
      />
      <button
        type="button"
        className="btn btn-outline-info"
        onClick={handleGenerate}
        disabled={loadingModel || generating}
      >
        {loadingModel ? "Carregando IA..." : generating ? "Gerando..." : "Gerar legenda/descrição"}
      </button>
    </div>
  );
}