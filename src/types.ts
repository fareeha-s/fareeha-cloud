export interface AppIcon {
  id: string;
  name: string;
  icon: string;
  color: string;
  component: React.FC<AppScreenProps>;
}

export interface AppScreenProps {
  onClose?: () => void;
  initialPosition?: { x: number; y: number; width: number; height: number };
}