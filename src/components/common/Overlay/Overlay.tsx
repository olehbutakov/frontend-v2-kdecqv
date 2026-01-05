import './Overlay.css';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Overlay = ({ isOpen, onClose }: OverlayProps) => {
  if (!isOpen) return null;

  return <div className="overlay" onClick={onClose} />;
};
