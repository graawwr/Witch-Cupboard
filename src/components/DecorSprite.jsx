import { useCallback, useState } from 'react';
import { DecorFallback } from './decorFallbacks.jsx';

const EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg'];

function decorUrl(pool, assetName, ext) {
  return `/cupboard/decor/${pool}/${assetName}.${ext}`;
}

export default function DecorSprite({ decor }) {
  const { pool, assetName, variant } = decor;
  const [extIndex, setExtIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    if (extIndex < EXTENSIONS.length - 1) {
      setExtIndex((i) => i + 1);
    } else {
      setFailed(true);
    }
  }, [extIndex]);

  if (!failed && extIndex < EXTENSIONS.length) {
    return (
      <img
        className="decor-sprite-img"
        src={decorUrl(pool, assetName, EXTENSIONS[extIndex])}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={handleError}
      />
    );
  }

  return <DecorFallback pool={pool} variant={variant} />;
}
