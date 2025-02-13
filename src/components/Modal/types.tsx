import { AudioBarProps } from "../AudioBar/types";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  musicData?: AudioBarProps;
}